import { opus } from './../api/opus';
import { bankid } from './../api/bankid';
import { settings } from './../settings';
import { tools } from './../helpers/tools';
import { dom } from './../helpers/dom';
import { claims } from '../api/claims';
import { storage } from './../helpers/storage';
import { configuration } from '../api/configuration';
import moment from 'moment';
import { ValueText, Clinician, Filter, Patient, Booking as BookingModel } from './../api/models';
import { geo } from './../helpers/google';
import { googleMapStyles } from './../helpers/googleMapStyle';

// document.cookie = "cookieName=";
class Booking {
    constructor(underscore, hd) {
        this._ = underscore;
        this.hd = hd;
        this.config = null;
        this.booking = new BookingModel();
        this.timeSlots = null;
        this.referrer = null;
        this.filter = new Filter();
        this.cityName = null;
        this.steps = [0, 1, 2, 3, 4, 5, 6, 7];
        this.step = 0;
        this.daterangeStart = null;
        this.daterangeEnd = null;
        this.timeSlotLoading = false;
        this.googleApi = null;
    }

    saveBooking(booking) {
        storage.set('booking', JSON.stringify(booking));
    }

    deleteBooking() {
        storage.remove('booking');
    }

    getBooking() {
        const stored = storage.get('booking');

        if (stored) {
            return JSON.parse(stored);
        }

        return null;
    }

    decodeQueryString(queryString) {
        const params = new URLSearchParams(queryString);
        const result = {};
        params.forEach((value, key) => {
            result[key] = value.split(',')[0];
        })
        return result;
    }

    init(googleApi, resources) {
        const self = this;
        self.hd.opus = opus;

        self.googleApi = googleApi;
        geo.init(googleApi, resources);

        settings.init();
        opus.init();

        // const hash = window.location.hash.substr(1).split(',');
        const urlString = window.location.href;

        const hash = urlString.split('#')[1] ? urlString.split('#')[1].split('?')[0].split(',') : [];
        const queryString = urlString.split('?')[1];
        const decodedQueryString = self.decodeQueryString(queryString);
        if (decodedQueryString.cityName) {
            self.cityName = decodedQueryString.cityName;
        }
        configuration
            .get()
            .then((config) => {
                self.config = config.result;

                self.changeDateRangeWeek(0, false);

                return opus.getTreatments();
            })
            .then(() => {
                return opus.getClinics();
            })
            .then(() => {
                const booking = self.getBooking();

                if (settings.settings.regions) {
                    for (let i = 0; i < settings.settings.regions.length; i++) {
                        const clinic = tools.findByValue(settings.settings.regions[i].clinics, 'path', hash[0]);

                        if (clinic) {
                            self.filter.clinic = tools.findByValue(opus.clinics, 'id', clinic.id);
                            break;
                        }
                    }
                }

                if (booking && hash.length < 6) {
                    self.booking = booking;

                    const isnew =
                        hash.length != 1 || (self.filter.clinic && self.filter.clinic.id != self.booking.timeSlot.clinicId);

                    self.booking.timeSlot.clinic = tools.findByValue(opus.clinics, 'id', self.booking.timeSlot.clinicId);
                    self.booking.timeSlot.treatment = tools.findByValue(
                        opus.treatments,
                        'id',
                        +self.booking.timeSlot.treatmentId
                    );

                    if (self.booking.timeSlot.clinic) {
                        self.booking.timeSlot.clinician = tools.findByValue(
                            self.booking.timeSlot.clinic.clinicians,
                            'id',
                            +self.booking.timeSlot.clinicianId
                        );
                    }

                    if (
                        !self.booking.timeSlot.clinician ||
                        !self.booking.timeSlot.treatment ||
                        !self.booking.timeSlot.clinic ||
                        isnew
                    ) {
                        (self.booking.reservationId ? opus.deleteReservation(self.booking.reservationId) : Promise.resolve())
                            .catch(() => { })
                            .finally(() => {
                                if (!isnew) {
                                    window.location = '/tandlakare';
                                    return;
                                }
                            });

                        if (hash.length == 2) {
                            window.location.hash = `#${hash[0]}`;
                        }

                        self.deleteBooking();
                        self.booking = new BookingModel();
                    } else {
                        self.filter.treatment = self.booking.timeSlot.treatment;
                        self.filter.clinic = self.booking.timeSlot.clinic;

                        self.saveBooking(self.booking);
                    }
                } else if (hash.length >= 6) {
                    self.booking.timeSlot = {
                        clinicId: hash[0],
                        id: +hash[1],
                        start: hash[2],
                        end: hash[3],
                        clinicianId: +hash[4],
                        treatmentId: +hash[5],
                        clinic: tools.findByValue(opus.clinics, 'id', hash[0]),
                        treatment: tools.findByValue(opus.treatments, 'id', +hash[5]),
                        discountedPrice: +hash[6],
                    };

                    self.filter.treatment = self.booking.timeSlot.treatment;
                    self.filter.clinic = self.booking.timeSlot.clinic;

                    if (self.booking.timeSlot.clinic) {
                        self.booking.timeSlot.clinician = tools.findByValue(
                            self.booking.timeSlot.clinic.clinicians,
                            'id',
                            self.booking.timeSlot.clinicianId
                        );
                    }

                    if (!self.booking.timeSlot.clinician || !self.booking.timeSlot.treatment || !self.booking.timeSlot.clinic) {
                        window.location = '/tandlakare';
                        return;
                    }

                    self.saveBooking(self.booking);
                }

                if (hash.length >= 7 && tools.isValidReferrer(hash[7])) {
                    self.referrer = hash[7];
                }

                if (self.booking.timeSlot.id) {
                    self.selectTreatment(self.booking.timeSlot.treatmentId, 5);
                    self.selectTimeSlot(self.booking.timeSlot);
                }

                self.load();
            })
            .catch((response) => {
                tools.handleError(self, response, $('#hd-b-error'));

                $('.hd-progress').css('display', 'none');
            });
    }

    changeDateRangeWeek(increment, fetchTimeSlot) {
        const self = this;
        if (!self.timeSlotLoading) {
            const currentWeekNumber = moment().isoWeeks();
            const currentWeekDays = moment().isoWeekday();
            if (increment === 0) {
                self.filter.daterangeStart = new Date();
                self.filter.daterangeEnd = tools.addDaysToNow(7 - currentWeekDays);
            } else if (increment === -1 && moment(self.filter.daterangeStart).isoWeeks() != currentWeekNumber) {
                self.filter.daterangeEnd = tools.addDaysToDate(-1, self.filter.daterangeStart);
                let startDate = tools.addDaysToDate(-6, self.filter.daterangeEnd);
                if (startDate < new Date()) {
                    startDate = new Date();
                }
                self.filter.daterangeStart = startDate;
            } else if (increment === 1) {
                self.filter.daterangeStart = tools.addDaysToDate(1, self.filter.daterangeEnd);
                self.filter.daterangeEnd = tools.addDaysToDate(6, self.filter.daterangeStart);
            } else {
                return;
            }
            if (moment(self.filter.daterangeStart).isoWeeks() === currentWeekNumber) {
                $("#hd-timeslot-week-no").html("Denna vecka");
            } else if (moment(self.filter.daterangeStart).isoWeeks() === currentWeekNumber + 1) {
                $("#hd-timeslot-week-no").html("Nästa vecka");
            } else {
                $("#hd-timeslot-week-no").html(`vecka ${moment(self.filter.daterangeStart).isoWeeks()}`);
            }

            if (fetchTimeSlot) {
                self.getTimeSlots();
            }
        }
    }

    markerCallback(map, clinic) {
        const self = this;

        const bounds = new self.googleApi.maps.LatLngBounds();

        bounds.extend(clinic.location);

        self.googleApi.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() > 15) {
                map.setZoom(15);
            }
        });

        map.fitBounds(bounds);
    }

    loadClinicsMaps(clinics) {
        //const self = this;
        const self = this;
        let map,
            hd_map = $('#hd-booking-clinics-map');

        map = geo.map.create(hd_map[0], googleMapStyles.blackAndWhite);

        clinics.forEach((clinic) => {
            // Need to be defined or else templates will fail
            const opusClinic = tools.findByValue(opus.clinics, 'id', clinic.id);
            // TODO create static html for clinic marker tooltip
            let citypath = opusClinic.city;

            if (opusClinic) {
                if (clinic.id == "133153-bc8a67ac-b384-4d3e-b8dd-1b7a80b65fcc") {
                    citypath = "GÖTEBORG";
                }
                if (clinic.id == "20778-bc8a67ac-b384-4d3e-b8dd-1b7a80b65fcc") {
                    citypath = "STOCKHOLM";
                }
                if (clinic.id == "83774-bc8a67ac-b384-4d3e-b8dd-1b7a80b65fcc") {
                    citypath = "STOCKHOLM";
                }
            }
            let markerTooltipContent = `<div class="tooltip-text">
                                            <h4 class="black-heading">${opusClinic.name}</h4>
                                            <hr>
                                            <div class="small">${opusClinic.address1}, ${opusClinic.city}</div>
                                            <div>
                                                <a href="/tandlakare/${citypath.toLowerCase()}/${clinic.path}" class="button">Read More <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                        </div>`;
            let infowindow = new self.googleApi.maps.InfoWindow({
                content: markerTooltipContent,
            });
            if (!clinic.distance) clinic.distance = null;
            geo.map.markLocation(map, clinic.location, (marker) => {
                console.log("marker clicked", marker);
                // self.markerCallback(map, clinic);
                infowindow.open(map, marker);
            });

        });

        $('#hd-booking-clinics-map').show(300, () => {
            geo.map.fitBounds(map, clinics);
        });
    }

    populateClinicsForCity() {
        const self = this;
        if (self.cityName) {
            for (let i = 0; i < settings.settings.regions.length; i++) {
                if (self.cityName === settings.settings.regions[i].city) {
                    self.loadClinicsMaps(settings.settings.regions[i].clinics);
                    const clinicsBooking = $('#hd-clinics-booking-rows'),
                        clinicTemplate = self._.template($('#tmpl-hd-clinics-booking-row').html());
                    clinicsBooking.html('');
                    settings.settings.regions[i].clinics.forEach((h) => {
                        const opusClinic = tools.findByValue(opus.clinics, 'id', h.id);

                        if (opusClinic) {
                            opusClinic['citypath'] = opusClinic.city;
                            if (h.id == "133153-bc8a67ac-b384-4d3e-b8dd-1b7a80b65fcc") {
                                opusClinic['citypath'] = "GÖTEBORG";
                            }
                            if (h.id == "20778-bc8a67ac-b384-4d3e-b8dd-1b7a80b65fcc") {
                                opusClinic['citypath'] = "STOCKHOLM";
                            }
                            if (h.id == "83774-bc8a67ac-b384-4d3e-b8dd-1b7a80b65fcc") {
                                opusClinic['citypath'] = "STOCKHOLM";
                            }
                            opusClinic['path'] = h.path;
                            clinicsBooking.append(clinicTemplate(opusClinic));
                        }
                    });
                    break;
                }
            }
        }
    }

    selectClinicAndCheckTreatment() {
        const self = this;
        try {
            if ((window.location.href.indexOf('?treatment') > 0 || window.location.href.indexOf('&clinician') > 0) && self.filter.clinic && self.filter.clinic.id) {
                let queryString = window.location.hash.split('?')[1];
                let param;
                if (window.location.href.indexOf('&clinician') > 0) {
                    param = queryString.split('=')[1].split('&'); // treatment param value if clinician exist
                } else {
                    param = window.location.hash.split('?')[1].split('=')[1].split(','); //treatment param value if clinician doesn't exist
                }

                let id = param[0]; // gives value of treatment id
                self.filter.treatment = tools.findByValue(opus.treatments, 'id', +id);

                param = window.location.hash.split('#')[1].split('?');
                const clinicName = param[0]; // gives value of clinic name
                let clinic;

                if (settings.settings.regions) {
                    // finds the clinic with path
                    for (let i = 0; i < settings.settings.regions.length; i++) {
                        clinic = tools.findByValue(settings.settings.regions[i].clinics, 'path', clinicName);
                        if (clinic) {
                            self.filter.clinic = tools.findByValue(opus.clinics, 'id', clinic.id);
                            break;
                        }
                    }
                }

                //get clinics
                $('#hd-filter-clinics').html('');
                opus.clinics.forEach((clinic) => {
                    $('#hd-filter-clinics').append(
                        `<option value="${clinic.id}"${clinic.id === self.filter.clinic.id ? ' selected' : ''}>${clinic.name
                        }, ${tools.toTitleCase(clinic.city)}</option>`
                    );
                });
                $('#hd-filter-clinics').trigger('change');

                $('#hd-filter-clinics').val(self.filter.clinic.id); // populates given clininc id

                // get clinicians
                self.filter.clinic = tools.findByValue(opus.clinics, 'id', $('#hd-filter-clinics').val());
                if (settings.settings.regions) {
                    dom.apply(null, self.filter.clinic);
                    $('#hd-time-rows').html('<div class="spinner-border" role="status"></div>');
                    $('#hd-filter-clinicians')
                        .prop('disabled', 'disabled')
                        .html(`<option value="">${settings.resources.all}</option>`);

                    opus.getClinicians(self.filter.clinic.id, self.filter.treatment.id)
                        .then(() => {
                            opus.clinicians.forEach((clinician) => {
                                if (clinician.isActive) {
                                    $('#hd-filter-clinicians').append(
                                        `<option value="${clinician.id}">${clinician.name}, ${clinician.title}</option>`
                                    );
                                }
                            });

                            // $('#hd-filter-clinicians').trigger('change');

                            if (window.location.href.indexOf('&clinician') > 0) {
                                try {
                                    queryString = window.location.hash.split('&')[1];
                                    param = queryString.split('=')[1].split(',') || '';
                                    id = param[0]; // gives value of clinician id

                                    opus.getClinicians(self.filter.clinic.id, self.filter.treatment.id)
                                        .then((allClinician) => {
                                            const clinicianValue = tools.findByValue(allClinician.result, 'id', +id);
                                            self.filter.clinician = tools.findByValue(allClinician.result, 'id', +id);
                                            $('#hd-filter-clinicians').val(clinicianValue.id);
                                            $('#hd-filter-clinicians').prop('disabled', false);
                                            self.getTimeSlots();
                                        })
                                        .catch((response) => {
                                            tools.handleError(self, response, $('#hd-b-error'));
                                        });
                                } catch (response) {
                                    tools.handleError(self, response, $('#hd-b-error'));
                                }
                            } else {
                                $('#hd-filter-clinicians').prop('disabled', false);
                                $('#hd-filter-clinicians').trigger('change');
                            }
                        })
                        .catch((response) => {
                            tools.handleError(self, response, $('#hd-b-error'));
                        });
                }
                if (
                    window.location.href.split(',')[1] == 2 ||
                    window.location.href.split(',')[1] == undefined ||
                    window.location.href.split(',')[1] == 3
                ) {
                    self.navigate(3);
                }
            } else if (self.filter.clinic && self.filter.clinic.id) {
                self.navigate(2);
            }
        }
        catch (response) {
            tools.handleError(self, response, $('#hd-b-error'));
        }
    }

    load() {
        const self = this;
        const treatments = $('#hd-treatment-rows'),
            template = self._.template($('#tmpl-hd-treatment-row').html());
        treatments.html('');
        opus.treatments.forEach((h) => {
            if (tools.inArray(self.config.treatments, h.id, 'treatmentId')) {
                treatments.append(template(h));
            }
        });

        const cities = $('#hd-cities-booking-rows'),
            cityTemplate = self._.template($('#tmpl-hd-cities-booking-row').html());
        cities.html('');
        settings.settings.regions.forEach((h) => {
            cities.append(cityTemplate(h));
        });

        self.populateClinicsForCity();

        $('#hd-booking-page').hide();
        $('.hd-progress').css('display', 'flex');


        self.navigate();
        // for checking url
        self.selectClinicAndCheckTreatment();


        $('.hd-clinicname').html(this.filter.clinic.name);

        $('#hd-filter-clinics')
            .off('change')
            .on('change', () => {
                self.getClinicians();
            });

        $('#hd-filter-clinicians')
            .off('change')
            .on('change', (e) => {
                self.getTimeSlots();
                e.preventDefault();
            });

        $('#hd-step-footer-prev-timeslots')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();

                tools.trackView('behandling', $('#hd-step-2 h1').first().text(), self.filter.clinic, self.filter.treatment);

                window.location.href = window.location.href.split('?')[0] + ',1';
                self.navigate(3);
            });

        $('#hd-back-button-clinic')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();
                self.navigate(0);
            });

        $('#hd-back-button-treatment')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();
                self.navigate(1);
            });

        $('#hd-back-button-new-old-patient')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();
                self.navigate(2);
            });

        $('#hd-step-footer-prev-personal')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();
                (self.booking.reservationId ? opus.deleteReservation(self.booking.reservationId) : Promise.resolve())
                    .catch(() => { })
                    .finally(() => {
                        self.deleteBooking();

                        if (self.referrer && tools.isValidReferrer(self.referrer)) {
                            window.location = self.referrer;
                        } else {
                            tools.trackView(
                                'tid',
                                $('#hd-step-4 h1').first().text(),
                                self.filter.clinic,
                                self.filter.treatment,
                                self.booking.timeSlot.discountedPrice ? 'Sista minuten' : 'Ordinarie'
                            );

                            self.selectTreatment(self.filter.treatment.id, 5);
                            self.navigate(4);
                        }
                    });
            });

        $('#hd-step-footer-skip-health-1, #hd-step-footer-skip-health-2')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();

                self.navigate(7);
            });

        $('#hd-step-footer-next-personal')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();

                self.validateBooking();
            });

        $('#hd-step-footer-prev-confirm')
            .off('click')
            .on('click', (e) => {
                e.preventDefault();

                self.navigate(5);
            });

        $('.hd-selecttreatment')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.selectTreatment($(this).data('id'));
            });

        $('.hd-new-patient-click')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.booking.isNewPatientBooking = true;
                self.saveBooking(self.booking);
                self.navigate(4);
            });

        $('.hd-return-patient-click')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.booking.isNewPatientBooking = false;
                self.saveBooking(self.booking);
                self.navigate(4);
            });

        $('.hd-city-row-click')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.cityName = $(this).data('id');
                self.populateClinicsForCity();
                self.navigate(1);
            });

        $('#hd-step-5-logon-login')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();

                self.login(5);
            });

        $('.verifyotp').hide();
        $('#hd-step-5-mobotplogon-login')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.sendotp();
            });

        $('#hd-step-5-moblogon-login')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();

                self.verifyotp();
            });

        $('#hd-step-5-resendlogon-login')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();

                self.resendotp();
            });

        $('#hd-timeslot-week-prev')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.changeDateRangeWeek(-1, true);
            });

        $('#hd-timeslot-week-next')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.changeDateRangeWeek(1, true);

            });

        $('#hd-timeslot-week-load-next')
            .off('click')
            .on('click', function (e) {
                e.preventDefault();
                self.changeDateRangeWeek(1, true);

            });
    }

    textdanish() {

        var myValue = localStorage.getItem("mobnumber");
        $('#personal-d-1').html(`Du har valgt`);
        $('.personal-d-2').html(`uret`);
        $('.personal-d-3').html(`det`);
        $('#hd-step-5-email-text').html(`EMAIL ADRESSE<span class="hd-mandatory">*</span>`);
        $('#hd-step-5-email').attr('placeholder', 'email....');
        $('#danish-phone').html(`MOBILNUMMER <span class="hd-mandatory">*</span>`);
        $('#hd-step-5-fullname').hide();
        $('#hd-step-5-phone').val(myValue);
        $('#hd-step-5-phone').attr('disabled', 'disabled');
        $('#danish-voucher').html('RABATKODE');
        $('#discount-discription').text('Indtast gyldig rabatkode (indtast eller kopier fra tilbud)');
        $('#messagediv').hide();
        $('#danish-dental-fear').html('Jeg er bange for tandpleje');
        $('#danish-personal-checkbox-consentpersonal').html(`Jeg accepterer, at mine personlige data bruges af aftalebestillingssystemet til at administrere bookingen af aftalen. Jeg accepterer også, at mit mobilnummer og e-mailadresse bruges til kommunikation vedrørende et bestemt tidspunkt.<span class="hd-mandatory">*</span>`);
        $('#danish-hd-step-5-consentoffers').html('Jeg accepterer, at mit mobilnummer og e-mailadresse bruges til kommunikation vedrørende nyheder og tilbud.');
        $('#hd-step-5-email-err').html('email');
        $('#hd-step-footer-prev-personal').html('TILLBAGE');
        $('#confirm').html('bekræfte');
        $('#skip').html('spring over');
        $('#thank').html('Tak for din reservation');
        $('#adult-1').html('Du er velkommen til');
        $('#adult-4').html(`Hvis du bliver forhindret, så glem ikke at afbestille eller ændre din aftale gratis telefonisk op til 24 timer før dit besøg.

         Velkommen!`);


        $('#hd-health-con').html(`Tid reserveret til uret den .
         Her kan du forberede dig til dit besøg ved at udfylde din helbredserklæring`);

    }





    sendotp() {

        const mobnumber = $('#hd-step-5-moblogon-mobileno').val();
        localStorage.setItem('mobnumber', mobnumber);
        const valid = tools.validatePhone(mobnumber);
        // var numberRegex = /^\d{7,13}$/;
        // if ($('#hd-step-5-moblogon-mobileno').val().match(numberRegex)) 
        if (valid) {
            $('#mob_error').hide();
            const countryid = $('#countrycode').val();
            configuration
                .sendOtp({ mobileNumber: mobnumber, countryCode: countryid })
                .then(() => {
                    //finish
                    $('.verifyotp').show();
                    $('#mob_error ,#hd-step-5-mobotplogon-login').hide();
                    if (!$('#otp_msg').length) {
                        $('#hd-step-5-mobotplogon-mobileno').before("<div id='otp_msg'> Engangskoden blev sendt </div>");
                    }
                    setTimeout(function () {
                        jQuery('#otp_msg').remove();
                    }, 5000);
                    $('#otp_msg').css('color', 'green');
                })

                .catch(() => {
                    //error
                    if (!$('#mob_error1').length) {
                        $('#hd-step-5-mobotplogon-login').before(
                            // "<div id='mob_error1'> Your Otp is not sent to registered number </div>"
                            "<div id='mob_error1'> Din Otp sendes ikke til registreret nummer </div>"
                        );
                    }
                });
        } else {
            if (!$('#mob_error').length) {
                $('#hd-step-5-mobotplogon-login').before(
                    // "<div id='mob_error'> Your Mobile Number should be greater than 7 digit </div>"
                    "<div id='mob_error'> Dit mobilnummer skal være på mere end 7 cifre </div>"

                );
            }
        }

        $('#mob_error ,#mob_error1').css('color', 'red');
    }


    verifyotp() {
        const otp = $('#hd-step-5-mobotplogon-mobileno').val();
        const valid = tools.validateOtp(otp);
        const self = this;

        if (valid)
        // if($('#hd-step-5-mobotplogon-mobileno').val().length == 6)
        {

            const mobnumber = $('#hd-step-5-moblogon-mobileno').val();
            const countryid = $('#countrycode').val();
            configuration
                .verifyOtp({ mobileNumber: mobnumber, countryCode: countryid, otp: otp })
                .then((response) => {
                    if (response.status == 200) {

                        localStorage.setItem("currentlang", "danish_");


                        if ($('#countrycode').val() == "46") {
                            $(`#hd-step-5-logon`).show();
                            $(`#hd-step-5-moblogon`).hide()
                            $(`#hd-step-5-personal`).hide();

                        }
                        else {
                            $('#hd-mypages-nav').hide();
                            $('#hd-step-5-moblogon').hide();
                            $('#hd-step-5-logon').hide();
                            $('#hd-step-5-personal').show();

                            self.loadPersonalInformation();

                        }
                    }
                    else {
                        if (!$('#otp_msg').length) {
                            $('#hd-step-5-mobotplogon-mobileno').before("<div id='otp_msg'> Den indtastede OTP er ikke korrekt  </div>"); //The OTP entered is not correct
                        }
                        setTimeout(function () {
                            jQuery('#otp_msg').remove();
                        }, 5000);
                        $('#otp_msg').css('color', 'red');
                        $(`#hd-step-5-moblogon`).show();
                        $('#hd-step-5-logon').show();

                    }


                })

                .catch(() => {

                    if (!$('#otp_msg').length) {
                        $('#hd-step-5-mobotplogon-mobileno').before("<div id='otp_msg'> Den indtastede OTP er ikke korrekt  </div>"); //The OTP entered is not correct
                    }
                    setTimeout(function () {
                        jQuery('#otp_msg').remove();
                    }, 5000);
                    $('#otp_msg').css('color', 'red');
                    $(`#hd-step-5-moblogon`).show();
                    $('#hd-step-5-logon').show();
                });
        }

        else {
            if (!$('#otp_msg').length) {
                $('#hd-step-5-mobotplogon-mobileno').before("<div id='otp_msg'> Den indtastede OTP-længde skal være 6 cifre  </div>"); //The OTP length entered must be 6 digits
            }
            setTimeout(function () {
                jQuery('#otp_msg').remove();
            }, 5000);
            $('#otp_msg').css('color', 'red');
            $(`#hd-step-5-moblogon`).show();

        }

    }


    resendotp() {
        const self = this;

        self.sendotp();
    }

    login(step) {
        const self = this;
        const personalNumber = $(`#hd-step-${step}-logon-ssn`).val();
        const valid = tools.validatePersonalNumber(personalNumber);
        if (valid) {
            $(`#hd-step-${step}-logon-ssn-err, #hd-step-${step}-logon-login-dologin`).hide();
            $(`#hd-step-${step}-logon-login .spinner-border, #hd-step-${step}-logon-login-loggingin`).show();
            $(`#hd-step-${step}-logon-login`).addClass('disabled');

            tools.trackEvent('bankid-login-started');

            bankid
                .auth(personalNumber, (collect) => {
                    if (collect.code) {
                        $(`#hd-step-${step}-logon-status`).text(collect.message).removeClass('hd-error').show();
                    }
                })
                .then((auth) => {
                    const user = auth.result.response.completionData.user;
                    localStorage.setItem("currentlang", "");
                    tools.trackEvent('bankid-login-done');

                    self.booking.patient = new Patient(user.personalNumber, user.givenName, user.surname);

                    $(`#hd-step-${step}-logon, #hd-step-${step} .hd-error, #hd-step-${step} .hd-info`).hide();
                    $(`#hd-step-${step}-personal`).show();
                    self.loadPersonalInformation();
                })
                .catch((auth) => {
                    if (!auth.code == 'userCancel') {
                        tools.handleError(self, auth, $(`#hd-step-${step}-logon-error`));
                    }

                    $(`#hd-step-${step}-logon`).show();
                    $(`#hd-step-${step}-personal`).hide();
                })
                .finally(() => {
                    $(`#hd-step-${step}-logon-login .spinner-border, #hd-step-${step}-logon-login-loggingin`).hide();
                    $(`#hd-step-${step}-logon-login-dologin`).show();
                    $(`#hd-step-${step}-logon-login`).removeClass('disabled');
                });
        } else {
            $(`#hd-step-${step}-logon-ssn-err`).show(200);
        }
    }

    loadHealth() {
        const self = this;

        self.hd.views.healthDeclaration.load(function () {
            self.navigate(7);
        });
    }

    loadPersonalInformation() {

        $("iframe#hs-form-iframe-0").css('height', '0');
        var iFrameDOM = $("iframe#hs-form-iframe-0").contents();
        iFrameDOM.find(".hs-submit").css('display', 'none');

        const self = this;

        claims
            .get()
            .then((claim) => {

                if (self.booking.patient.personalNumberAsString != claim.result.personalNumberAsString) {
                    self.booking.patient = new Patient(
                        claim.result.personalNumberAsString,
                        claim.result.givenName,
                        claim.result.familyName
                    );

                }


                /*  self.booking.currentlanguage = localStorage.getItem('current_lang' ) || '';  */


                const template = self._.template($('#tmpl-hd-personal').html());

                $('#hd-step-5-personal').html(template(self.booking));

                if (localStorage.getItem('currentlang') === "danish_") {

                    self.textdanish();
                }

                $('#hd-step-5-personal').show();
                $('#hd-step-5-logon').hide();

                $('#hd-step-5-moblogon').hide();
                $('#hd-step-footer-next-personal').show();

                $('#hd-step-5-logout')
                    .off('click')
                    .on('click', function () {
                        claims
                            .destroy()
                            .then(() => {
                                $('#hd-step-5 .hd-error, #hd-step-5-personal').hide();
                                $('#hd-step-5-moblogon').show();
                                $('#hd-step-5-logon').show();
                            })
                            .catch((response) => {
                                tools.handleError(self, response, $('#hd-b-5-error'));
                            });
                    });
            })
            .catch(() => {
                $('#hd-step-5-personal, #hd-step-footer-next-personal').hide();
                $('#hd-step-5-moblogon').show();
                $('#hd-step-5-logon').show();

            });
    }

    getTimeSlots() {
        const self = this;

        self.timeSlotLoading = true;
        if (!$('#hd-filter-clinicians').val()) {
            window.location.href = window.location.href.split('&')[0];
            if (window.location.href.split(',')[1] == 2) {
                window.location.href = window.location.href;
            } else {
                window.location.href = `${window.location.href},2`;
            }
        }
        const clinicianId = $('#hd-filter-clinicians').val(),
            container = $('#hd-time-rows'),
            template = self._.template($('#tmpl-hd-time-row').html());

        self.filter.clinician = clinicianId ? tools.findByValue(opus.clinicians, 'id', +clinicianId) : new Clinician();

        // adds clician id to url
        if (self.filter.clinician.name !== undefined) {
            //removes previous clinician id
            window.location.href = window.location.href.split(',')[0];
            if (window.location.href.indexOf('&clinician=') > 0) {
                window.location.href = window.location.href.split('&')[0];
            }
            // adds new selected clinician's id
            window.location.href = `${window.location.href}&clinician=${self.filter.clinician.id},2`;
        }

        container.html('<div class="spinner-border" role="status"></div>').show();

        $('#hd-b-notimeslots').hide();

        opus.getTimeSlotsForDateRange(
            self.filter.clinic.id,
            self.filter.daterangeStart,
            self.filter.daterangeEnd,
            self.filter.treatment.id,
            self.filter.treatment.duration,
            self.filter.clinician.id
        )
            .then((response) => {
                self.timeSlots = response.result;

                container.html('');
                if (self.timeSlots.length === 0) {
                    $('#hd-b-notimeslots').show();
                } else {
                    $('#hd-b-notimeslots').hide();
                    const dateRangeArray = [];
                    let loop = new Date(self.filter.daterangeStart);
                    while (loop <= self.filter.daterangeEnd) {
                        const dateObj = {
                            dateFormated: tools.formatToPrefix(loop.toISOString()) + ', ' + tools.formatToDate(loop.toISOString()),
                        };
                        const timeSlotsForDate = self._.filter(self.timeSlots, (obj) => {
                            return tools.formatToDate(loop.toISOString()) === tools.formatToDate(obj.start);
                        })
                        dateObj["timeSlots"] = timeSlotsForDate;
                        dateRangeArray.push(dateObj);
                        let newDate = loop.setDate(loop.getDate() + 1);
                        loop = new Date(newDate);
                    }

                    dateRangeArray.forEach((timeslotForDate) => {
                        container.append(template(timeslotForDate));
                    })

                    $('.hd-selecttimeslot')
                        .off('click')
                        .on('click', function (e) {
                            e.preventDefault();

                            const timeSlot = opus.findTimeSlot(
                                self.timeSlots,
                                $(this).data('id'),
                                $(this).data('clinicid'),
                                $(this).data('start')
                            );
                            timeSlot.clinic = tools.findByValue(opus.clinics, 'id', timeSlot.clinicId);
                            timeSlot.clinician = tools.findByValue(opus.clinicians, 'id', +timeSlot.clinicianId);
                            self.selectTimeSlot(timeSlot);
                        });
                }
                self.timeSlotLoading = false;
            })
            .catch((response) => {
                tools.handleError(self, response, $('#hd-b-error'));
                self.timeSlotLoading = false;
                $('.hd-progress').css('display', 'none');
            });
    }

    getClinicians() {
        const self = this;
        // todo need to uncomment
        // self.filter.clinic = tools.findByValue(opus.clinics, 'id', $('#hd-filter-clinics').val());

        if (settings.settings.regions) {
            settings.settings.regions.forEach((region) => {
                const clinic = tools.findByValue(region.clinics, 'id', self.filter.clinic.id);

                if (clinic) {
                    // if clinic changes , remove previous clinician (maintaining treatment's value) in url

                    if (window.location.href.indexOf('?treatment=') > 0) {
                        const hash = window.location.hash.split('?')[1].split('&');

                        if (hash !== undefined) {
                            if (window.location.href.indexOf(',') > 0) {
                                window.location.hash = `#${clinic.path}?${hash[0]}`;
                            } else {
                                window.location.hash = `#${clinic.path}?${hash[0]},2`; // maintains step's value
                            }
                        }
                    } else {
                        window.location.hash = `#${clinic.path}`; //if no treatment is selected yet
                    }
                }
            });
        }

        dom.apply(null, self.filter.clinic);

        $('#hd-time-rows').html('<div class="spinner-border" role="status"></div>');

        $('#hd-filter-clinicians').prop('disabled', 'disabled').html(`<option value="">${settings.resources.all}</option>`);

        opus.getClinicians(self.filter.clinic.id, self.filter.treatment.id)
            .then(() => {
                for (let i = 0; i < opus.clinicians.length; i++) {
                    const clinician = opus.clinicians[i];

                    if (clinician.isActive) {
                        $('#hd-filter-clinicians').append(
                            `<option value="${clinician.id}">${clinician.name}, ${clinician.title}</option>`
                        );
                    }
                }

                $('#hd-filter-clinicians').prop('disabled', false).trigger('change');
            })
            .catch((response) => {
                tools.handleError(self, response, $('#hd-b-error'));
            });
    }

    selectTreatment(id, goTo) {
        const self = this;

        self.filter.treatment = tools.findByValue(opus.treatments, 'id', id);

        if (!self.filter.treatment) {
            return;
        }

        tools.trackView('tid', $('#hd-step-4 h1').first().text(), self.filter.clinic, self.filter.treatment);

        dom.apply(null, self.filter.clinic, null, self.filter.treatment);

        $('#hd-filter-clinics').html('');

        for (let i = 0; i < opus.clinics.length; i++) {
            const clinic = opus.clinics[i];

            $('#hd-filter-clinics').append(
                `<option value="${clinic.id}"${clinic.id === self.filter.clinic.id ? ' selected' : ''}>${clinic.name
                }, ${tools.toTitleCase(clinic.city)}</option>`
            );
        }

        $('#hd-filter-clinics').trigger('change');

        //query string for treatment
        if (goTo !== 5) window.location.href = `${window.location.href}?treatment=${self.filter.treatment.id},2`;

        self.navigate(goTo || 3);
    }

    selectTimeSlot(timeSlot) {
        const self = this;

        if (!timeSlot || !timeSlot.start) {
            return;
        }

        const booking = self.getBooking();

        opus.checkReservation(timeSlot)
            .then((response) => {
                if (
                    !response.result.available &&
                    (!booking || (timeSlot.id != booking.timeSlot.id && timeSlot.start != booking.timeSlot.start))
                ) {
                    $('#hd-b-4-error').html(settings.settings.acf['opus_error_timeslot_notavailable']).show();

                    self.deleteBooking();
                    self.load();
                    self.selectTreatment(timeSlot.treatmentId);
                } else {
                    (booking && timeSlot.id == booking.timeSlot.id && timeSlot.start == booking.timeSlot.start
                        ? Promise.resolve()
                        : opus.createReservation(timeSlot)
                    )
                        .then((response) => {
                            tools.trackView(
                                'personlig',
                                $('#hd-step-5 h1').first().text(),
                                timeSlot.clinic,
                                self.filter.treatment,
                                timeSlot.discountedPrice ? 'Sista minuten' : 'Ordinarie'
                            );

                            dom.apply(timeSlot, timeSlot.clinic, timeSlot.clinician);

                            if (response) {
                                self.booking.reservationId = response.result.reservationId;
                            }

                            self.booking.timeSlot = timeSlot;

                            self.saveBooking(self.booking);
                            self.loadPersonalInformation();
                            if (window.location.href.indexOf('&clinician=') > 0) {
                                window.location.href = window.location.href.split(',')[0] + ',3';
                            } else {
                                window.location.href =
                                    window.location.href.split(',')[0] + `&clinician=${timeSlot.clinician.id},3`;
                            }

                            // Sending facebook pixel event to initiate checkout issue.
                            let treatment = tools.findByValue(opus.treatments, 'id', +self.booking.timeSlot.treatmentId);
                            tools.trackFBPixelInitiateCheckout(self.booking.reservationId, self.booking.timeSlot, treatment);

                            self.navigate(5);

                            $('#hd-b-4-error').hide(200);
                        })
                        .catch((response) => {
                            tools.handleError(self, response, $('#hd-b-4-error'));
                        });
                }
            })
            .catch((response) => {
                tools.handleError(self, response, $('#hd-b-4-error'));
            });
    }

    validateBooking() {
        const self = this;
        const patient = self.booking.patient;
        patient.email = $('#hd-step-5-email').val();
        patient.mobilePhoneNumber = $('#hd-step-5-phone').val();

        var country = localStorage.getItem("currentlang");
        if (country == "danish_") {
            self.booking.freeTextMessage = "This is danish user , Phone no is = +45 " + patient.mobilePhoneNumber + " And Email = " + patient.email;
        } else {

            self.booking.freeTextMessage = $('#hd-step-5-message').val();
        }
        const acf = settings.settings.acf;

        self.booking.dentalFear = new ValueText(
            $('#hd-step-5-dentalfear').is(':checked'),
            acf['opus_bokning_freetext_dentalFear']
        );
        self.booking.consentPersonalInformation = new ValueText(
            $('#hd-step-5-consentpersonal').is(':checked'),
            acf['opus_bokning_freetext_consentPersonalInformation']
        );
        self.booking.consentNewsAndOffers = new ValueText(
            $('#hd-step-5-consentoffers').is(':checked'),
            acf['opus_bokning_freetext_consentNewsAndOffers']
        );
        self.booking.campaignCode = $('#hd-step-5-voucher').val();

        $('#hd-step-5 .hd-error').hide();
        if (patient.personalNumberAsString.length < 1 || patient.email.length < 1 || patient.mobilePhoneNumber.length < 1) {
            $('#hd-step-5-mandatory-err').show();

            return false;
        }

        let codeValid = true;
        let valid = true;

        dom.toggleSpinner('#hd-step-footer-next-personal', true);

        if (self.booking.freeTextMessage && self.booking.freeTextMessage.length > settings.freetextMaxLength) {
            $('#hd-step-5-freetext-err').show();

            valid = false;
        }

        if (!tools.validateEmail(patient.email)) {
            $('#hd-step-5-email-err').show();

            valid = false;
        }

        if (!tools.validatePhone(patient.mobilePhoneNumber)) {
            $('#hd-step-5-phone-err').show();

            valid = false;
        }

        if (!self.booking.consentPersonalInformation.value) {
            $('#hd-step-5-consentpersonal-err').show();

            valid = false;
        }

        if (valid) {
            codeValid = configuration.validateCampaignCode(self.config, self.booking.campaignCode);

            if (!codeValid) {
                $('#hd-b-5-error').html(settings.settings.acf['opus_error_validation_campaignCode']).show();
            }
        }

        if (valid && codeValid) {
            (self.booking.reservationId ? opus.deleteReservation(self.booking.reservationId) : Promise.resolve())
                .catch(() => { })
                .finally(() => {
                    self.trackPatientStatus(patient.email, patient.mobilePhoneNumber);
                });
        } else {
            dom.toggleSpinner('#hd-step-footer-next-personal');
        }
    }

    trackPatientStatus(patientEmail, patientMobileNumber) {
        const self = this;
        let patientisnew = null;
        opus.getPatientStatus()
            .then((status) => {
                patientisnew = status.result;
            })
            .catch(() => { })
            .finally(() => {

                if (localStorage.getItem('currentlang') == 'danish_') {
                    self.booking.patient.email = "do_not_change@happident.se";
                    self.booking.patient.mobilePhoneNumber = "46000000000";
                }
                opus.createBooking(self.booking)
                    .then((res) => {
                        let treatment = tools.findByValue(opus.treatments, 'id', +self.booking.timeSlot.treatmentId);
                        // tools.trackView(
                        //     'tack',
                        //     $('#hd-step-7 h1').first().text(),
                        //     self.booking.timeSlot.clinic,
                        //     self.booking.timeSlot.treatment,
                        //     self.booking.timeSlot.discountedPrice ? 'Sista minuten' : 'Ordinarie',
                        //     !patientisnew ? 'Återkommande' : 'Ny'
                        // );

                        tools.trackEvent(
                            patientisnew
                                ? self.booking.timeSlot.discountedPrice
                                    ? 'booking-done-new-lastminute'
                                    : 'booking-done-new'
                                : self.booking.timeSlot.discountedPrice
                                    ? 'booking-done-lastminute'
                                    : 'booking-done'
                        );

                        tools.trackConversion();
                        tools.trackEcommerce(res.result.bookingId, self.booking.timeSlot, treatment);
                        tools.trackFBPixelPurchase(res.result.bookingId, self.booking.timeSlot, treatment);
                        //2337856
                        // if (treatment.id == 2341301) {
                        // submit hubspot hidden form for invisible braces treatment
                        // treatmentid of invisible braces is 2341301
                        var iFrameDOM = $("iframe#hs-form-iframe-0").contents();
                        const appointmentDateTime = new Date(self.booking.timeSlot.start);
                        iFrameDOM.find('input[name="firstname"]').val(self.booking.patient.firstName);
                        iFrameDOM.find('input[name="lastname"]').val(self.booking.patient.lastName);
                        iFrameDOM.find('input[name="email"]').val(patientEmail);
                        iFrameDOM.find('input[name="phone"]').val(localStorage.getItem('currentlang') == 'danish_' ? '+45' + patientMobileNumber : patientMobileNumber);
                        iFrameDOM.find('input[name="date_of_birth_date_picker_"]').val(self.booking.patient.personalNumberAsString.replace(/^(\d{4})(\d{2})(\d{2}).*/, '$1-$2-$3'));
                        iFrameDOM.find('input[name="consultation_appointment_date"]').val(appointmentDateTime.toISOString().split('T')[0]);
                        iFrameDOM.find('input[name="consultation_appointment_time"]').val(appointmentDateTime.toTimeString());
                        iFrameDOM.find('input[name="booking_clinic"]').val(self.booking.timeSlot.clinic.name.replace('Happident ', ''));
                        iFrameDOM.find('input[name="booking_treatment_type"]').val(treatment.name);
                        iFrameDOM.find('input[name="danish_patient"]').val(localStorage.getItem('currentlang') == 'danish_' ? 'YES' : 'NO');
                        iFrameDOM.find('input[name="booking_clinician"]').val(`${self.booking.timeSlot.clinician.name}`);
                        var iframedoc = document.getElementById('hs-form-iframe-0').contentWindow.document;
                        iframedoc.getElementsByTagName('form')[0].submit();
                        $("iframe#hs-form-iframe-0").submit();

                        const bookingConfirmContainer = $('#hd-booking-confirm-container');
                        const bookingConfirmTemplate = self._.template($('#hd-booking-confirm-tmpl').html());
                        const finalBooking = self.booking;
                        let locationObj = null;
                        for (let i = 0; i < settings.settings.regions.length; i++) {
                            for (let j = 0; j < settings.settings.regions[i].clinics.length; j++) {
                                if (settings.settings.regions[i].clinics[j].id === finalBooking.timeSlot.clinicId) {
                                    locationObj = settings.settings.regions[i].clinics[j].location;
                                    break;
                                }
                            }
                        }
                        finalBooking.clinicLatitude = 0.0;
                        finalBooking.clinicLongitude = 0.0;
                        if (locationObj) {
                            finalBooking.clinicLatitude = locationObj.lat;
                            finalBooking.clinicLongitude = locationObj.lng;
                        }
                        bookingConfirmContainer.append(bookingConfirmTemplate(finalBooking));
                        // }
                        self.deleteBooking();

                        // const isChild = tools.isChild(self.booking.patient.personalNumberAsString);

                        // $('#hd-step-7-text-adult').toggle(!isChild);
                        // $('#hd-step-7-text-child').toggle(isChild);
                        $('#hd-b-5-error').hide(200);

                        if (localStorage.getItem('currentlang') != 'danish_') {
                            self.loadHealth();
                            self.navigate(6);
                        } else {
                            self.navigate(7);
                        }

                    })
                    .catch((response) => {
                        tools.handleError(self, response, $('#hd-b-5-error'));
                    })
                    .finally(() => {
                        dom.toggleSpinner('#hd-step-footer-next-personal');
                    });
            });
    }

    navigate(to) {
        const self = this;

        console.log("navigate to called with step", to, self.filter.clinic);
        self.step = typeof to != 'undefined' ? to : self.step;
        if (typeof to != 'undefined') {
            self.step = to;
        } else if (!self.cityName && (!self.filter.clinic || !self.filter.clinic.id)) {
            self.step = 0;
        } else if (!self.filter.clinic || !self.filter.clinic.id) {
            self.step = 1;
        } else {
            self.step = 2;
        }
        console.log("after condition step value", self.step);

        for (let i = 0; i < self.steps.length; i++) {
            let step = self.steps[i];

            if (step == self.step) {
                $(`#hd-step-${step}`).show(200);

            } else {
                $(`#hd-step-${step}`).hide(200);
            }
        }

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

(function (hd, _) {
    hd.views = hd.views || {};
    hd.views.booking = new Booking(_, hd);
    // eslint-disable-next-line no-undef
})((window.hd = window.hd || {}), _);
