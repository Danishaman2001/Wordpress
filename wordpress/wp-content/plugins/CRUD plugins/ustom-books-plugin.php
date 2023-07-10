<?php
/*
Plugin Name: Custom Form
Description: Custom form plugin to save data in custom table using AJAX.
Version: 1.0
Author: Your Name
*/

register_activation_hook( __FILE__, 'create_custom_table' );

function create_custom_table() {
  global $wpdb;
  $charset_collate = $wpdb->get_charset_collate();
  $table_name = $wpdb->prefix . 'custom_form';

  $sql = "CREATE TABLE $table_name (
    id mediumint(9) NOT NULL AUTO_INCREMENT,
    first_name tinytext NOT NULL,
    last_name tinytext NOT NULL,
    email varchar(255) NOT NULL,
    PRIMARY KEY  (id)
  ) $charset_collate;";

  require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
  dbDelta( $sql );
}

function add_student_menu_page() {
    add_menu_page(
        'Student Detail',     // Page Title
        'Student Detail',     // Menu Title
        'manage_options',     // Capability required to access the menu page
        'student_detail',     // Menu Slug
        'render_student_page' // Callback function to render the page content
    );
}
add_action('admin_menu', 'add_student_menu_page');

function render_student_page() {
    // Place the code to render the content of the menu page here
    echo "<h1>Student Detail<h1>";
    global $wpdb;
    $output = '';
  
    // Fetch data from the database
    $table_name = $wpdb->prefix . 'custom_form';
    $data = $wpdb->get_results("SELECT * FROM $table_name", ARRAY_A);
  
    // Output the fetched data
    if ($data) {
        $output .= '<ul>';
        foreach ($data as $item) {
            $output .= '<li>';
            $output .= 'Name: ' . $item['name'] . '<br>';
            $output .= 'Phone: ' . $item['phone'] . '<br>';
            $output .= 'Email: ' . $item['email'] . '<br>';
            $output .= 'Message: ' . $item['message'] . '<br>';
            $output .= '</li>';
        }
        $output .= '</ul>';
    } else {
        $output .= 'No data found.';
    }
  
    return $output;
}

function custom_form_shortcode() {
    ob_start(); ?>
  
    <form id="custom-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" enctype="multipart/form-data">
      <input type="text" id="first_name" name="first_name" placeholder="First name">
      <input type="text" id="last_name" name="last_name" placeholder="Last name">
      <input type="email" id="email" name="email" placeholder="Email">
      <input type="submit" value="Submit">
    </form>
  
    <script type="text/javascript">
      jQuery('#custom-form').on('submit', function(e) {
        e.preventDefault();
  
        var firstName = jQuery('#first_name').val();
        var lastName = jQuery('#last_name').val();
        var email = jQuery('#email').val();
  
        jQuery.ajax({
          url : ajaxurl,
          type : 'post',
          data : {
            action : 'save_custom_form',
            first_name : firstName,
            last_name : lastName,
            email : email
          },
          success : function( response ) {
            alert( 'Form submitted successfully.' );
          }
        });
      });
    </script>
  
    <?php return ob_get_clean();
  }
  
  add_shortcode( 'custom_form', 'custom_form_shortcode' );


  add_action( 'wp_ajax_save_custom_form', 'save_custom_form' );
add_action( 'wp_ajax_nopriv_save_custom_form', 'save_custom_form' );

function save_custom_form() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'custom_form';

  $wpdb->insert( 
    $table_name, 
    array( 
      'first_name' => $_POST['first_name'], 
      'last_name' => $_POST['last_name'], 
      'email' => $_POST['email'] 
    ) 
  );

  wp_die();
}


add_action( 'admin_menu', 'custom_form_admin_menu' );

function custom_form_admin_menu() {
  add_menu_page( 'Custom Form Submissions', 'Custom Form', 'manage_options', 'custom-form', 'custom_form_admin_page', 'dashicons-admin-comments', 6 );
}

function custom_form_admin_page() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'custom_form';

  $results = $wpdb->get_results( "SELECT * FROM $table_name" );

  echo '<table>';
  echo '<tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th></tr>';

  foreach($results as $row) {
    echo '<tr><td>' . $row->id . '</td><td>' . $row->first_name . '</td><td>' . $row->last_name . '</td><td>' . $row->email . '</td></tr>';
  }

  echo '</table>';
}
?>