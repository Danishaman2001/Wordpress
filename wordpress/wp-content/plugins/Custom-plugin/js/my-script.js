// alert("hh");
jQuery(document).ready(function($) {
    $('#frmContactUs').submit(function(e){
        e.preventDefault();
        var name = $('#name').val();
        var phone = $('#phone').val();
        var email = $('#email').val();
        var message = $('#message').val();

        var data = {
            'action': 'insert_data',
            'name': name,
            'phone': phone,
            'email': email,
            'message': message
        };

        $.post(my_ajax_object.ajax_url, data, function(response) {
            alert(response);
        });
    });
});
