jQuery(document).ready(function($) {
    $('#custom-form').on('submit', function(e) {
        e.preventDefault();
        var form = $(this);
        var formData = form.serialize();
        formData += '&action=insert_data&nonce=' + customFormPluginAjax.nonce;
        
        $.ajax({
            url: customFormPluginAjax.ajax_url,
            type: 'POST',
            data: formData,
            beforeSend: function() {
                // Show loading spinner or any other indication
            },
            success: function(response) {
                if (response.success) {
                    // Show success message or perform any other action
                } else {
                    // Show error message or perform any other action
                }
            },
            error: function(xhr, status, error) {
                // Show error message or perform any other action
            },
            complete: function() {
                // Hide loading spinner or any other indication
            }
        });
    });
});
