<?php
/*
Plugin Name: Custom Plugin
 */

function my_plugin_activation(){
    global $wpdb;
    $table_name = $wpdb->prefix . 'my_plugin_forms';
    $sql = "CREATE TABLE $table_name (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        PRIMARY KEY (id)
    )";
    $wpdb->query($sql);
    
  
}
register_activation_hook(__FILE__,'my_plugin_activation');

function my_plugin_deactivation(){
   
}
register_deactivation_hook(__FILE__,'my_plugin_deactivation');

function my_sc_fun() {
    $output = '';
  
    ob_start(); ?>
    <form  id="frmContactUs">
      <label for="name">Name</label>
      <input type="text" name="name" id="name"><br>
      <br>
      <label for="number">PhoneNo:</label>
      <input type="phoneno" name="phone" id="phone"><br>
      <br>
      <br>
      <label for="email">Email</label>
      <input type="email" name="email" id="email"><br>
      <br>
      <label for="message">Message</label>
      <textarea name="message" id="message"></textarea><br>
      <br>
  
      <input type="hidden" name="action" value="insert_data">
        <input type="submit" value="submit" name="submit">
        
    </form>
    <?php
    
    $output .= ob_get_clean();
  
    return $output;
    
  }
  add_shortcode( 'mysecond', 'my_sc_fun' );

  function my_plugin_enqueue_scripts() {

    wp_enqueue_script( 'ajax-implementation.js', plugin_dir_url(__FILE__) . 'js/my-script.js', array( 'jquery' ) );
    wp_localize_script( 'my-plugin-submit-form', 'myplugin', array('ajaxurl' => admin_url( 'admin-ajax.php' ), ));
}
add_action('wp_enqueue_scripts', 'my_plugin_enqueue_scripts');



add_action( 'wp_ajax_insert_data', 'insert_data' );
add_action( 'wp_ajax_nopriv_insert_data', 'insert_data' );
function insert_data() {

    $name =  $_POST['name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'] ;
    $message = $_POST['message'] ;
  
  global $wpdb;
  
  $table_name = $wpdb->prefix . 'my_plugin_forms';
  $wpdb->insert( 
    $table_name, 
    array( 
        'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'message' => $message,
    ) 
);
 
echo 'Data inserted successfully';
wp_die();
//   if ( $result == 1 ) {
//     wp_send_json_success( array(
//       'message' => 'Data inserted successfully!',
//     ) );
//   } else {
//     wp_send_json_error( array(
//       'message' => 'Error inserting data!',
//     ) );
//   }
//   wp_die();
}


?>
<?php
function custom_form_plugin_menu_page() {
    add_menu_page(
        'Form Submissions',
        'Form Submissions',
        'manage_options',
        'custom-form-submissions',
        'custom_form_plugin_render_menu_page',
        'dashicons-list-view',
        20
    );
}
add_action( 'admin_menu', 'custom_form_plugin_menu_page' );

// Render the menu page content
function custom_form_plugin_render_menu_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'my_plugin_forms';
    $data = $wpdb->get_results("SELECT * FROM $table_name", ARRAY_A);
    ?>
    <div class="wrap">
        <h1>Form Submissions</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( $data )  : ?>
                    <?php foreach ( $data as $item ) : ?>
                        <tr>
                            <td><?php echo $item['id']; ?></td>
                            <td><?php echo $item['name']; ?></td>
                            <td><?php echo $item['phone'] ?></td>
                            <td><?php echo $item['email'] ?></td>
                            <td><?php echo $item['message'] ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr>
                        <td colspan="5">No submissions found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

?>

<?php
function fetch() {
  global $wpdb;
  $output = '';

  // Fetch data from the database
  $table_name = $wpdb->prefix . 'my_plugin_forms';
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
add_shortcode('fetch', 'fetch');


?>