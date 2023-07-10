alert('Hoiiiiiiiiiiiiiihhiihi');
jQuery(document).ready(function($) {
    $("#myForm").submit(function(e){
        e.preventDefault();
        
        var name = $("#name").val();
        var data = {
            'action': 'insert_data',
            'id': id,
            'name': name
        };
        $.post(my_ajax_object.ajax_url, data, function(response) {
            alert('Data saved successfully!');
        });
    });
});