// alert("hii");
jQuery(document).ready(function($) {
    // AJAX call when the button is clicked
    $('#my-ajax-button').on('click', function() {
        alert("hi");
        $.ajax({
            url: customAjax.ajaxUrl,
            type: 'POST',
            data: {
                action: 'my_ajax_action'
            },
            success: function(response) {
                // Handle the response from the server
                console.log(response);
            },
            error: function(xhr, status, error) {
                // Handle the error
                console.log(error);
            }
        });
    });
});
