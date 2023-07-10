<?php
/*
Plugin Name: Custom Cron Email
Description: Sends an email every hour using a custom cron job.
Version: 1.0
Author: Your Name
Author URI: Your Website
*/

// Plugin code goes here...
function send_hourly_email() {
    // Code to send the hourly email
    $to = 'amandanish148@gmail.com';
    $subject = 'Hourly Email';
    $message = 'This is your hourly email.';

    wp_mail($to, $subject, $message);
}

// Schedule the cron job on plugin activation
register_activation_hook(__FILE__, 'custom_cron_email_activation');
function custom_cron_email_activation() {
    // Check if the cron job is already scheduled
    if (!wp_next_scheduled('send_hourly_email_event')) {
        // Schedule the cron job to run every hour
        wp_schedule_event(time(), 'hourly', 'send_hourly_email_event');
    }
}

// Hook the cron job function to the scheduled event
add_action('send_hourly_email_event', 'send_hourly_email');

// Remove the cron job on plugin deactivation
register_deactivation_hook(__FILE__, 'custom_cron_email_deactivation');
function custom_cron_email_deactivation() {
    // Unschedule the cron job
    wp_clear_scheduled_hook('send_hourly_email_event');
}

// Add custom cron schedule interval
add_filter('cron_schedules', 'add_custom_cron_interval');
function add_custom_cron_interval($schedules) {
    $schedules['hourly'] = array(
        'interval' => 3600, // 1 hour = 60 seconds * 60 minutes
        'display' => __('Every hour')
    );
    return $schedules;
}

// Add admin page to display cron job status
add_action('admin_menu', 'custom_cron_email_admin_menu');
function custom_cron_email_admin_menu() {
    add_menu_page(
        'Custom Cron Email',
        'Custom Cron Email',
        'manage_options',
        'custom-cron-email',
        'custom_cron_email_admin_page',
        'dashicons-email',
        30
    );
}

// Callback function to render the admin page
function custom_cron_email_admin_page() {
    ?>
    <div class="wrap">
        <h1>Custom Cron Email</h1>
        <p>Status: <?php echo wp_next_scheduled('send_hourly_email_event') ? 'Active' : 'Inactive'; ?></p>
    </div>
    <?php
}
