jQuery(document).ready(function($) {
    $('#myForm').submit(function(e){
        e.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();

        var data = {
            'action': 'my_action',
            'name': name,
            'email': email
        };

        $.post(my_ajax_object.ajax_url, data, function(response) {
            alert('what do you want: ' + response);
        });
    });
});