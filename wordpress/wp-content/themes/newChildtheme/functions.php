<?php 
function myfunction(){
    //die("hello");
    wp_enqueue_style('my-style',get_stylesheet_directory_uri().'/css/style.css','','all');
    wp_enqueue_style('my-bootsrap',"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",'','all');
    // wp_enqueue_script('js',"https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js",'','all');
    // wp_enqueue_script('java',"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js",'','all');
    // wp_enqueue_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js', array(), '3.6.0', true);
    wp_enqueue_script( 'javascript', get_template_directory_uri() . '/js/custom-script.js','','', false );
    // wp_enqueue_script( 'jQuery', get_template_directory_uri() . '/js/custom-script.js', array(''), '1.0', false );


    
} 
add_action('wp_enqueue_scripts','myfunction');


// function my_plugin_enqueue_scripts() {
//     wp_enqueue_script('my-plugin-submit-form', plugin_dir_url(__FILE__) . 'js/my-script.js', array('jquery'), '1.0', true);
    
//     wp_localize_script( 'my-plugin-submit-form', 'myplugin', array(
//         'ajaxurl' => admin_url( 'admin-post.php' ),
//     ));
// }
// add_action('wp_enqueue_scripts', 'my_plugin_enqueue_scripts');

//
//die(get_stylesheet_directory_uri() . '/js/custom-script.js');





function my_ajax_callback() {
    // Process the AJAX request
    $response = 'This is the AJAX response.';
    echo $response;
    wp_die();
}
add_action( 'wp_ajax_my_ajax_action', 'my_ajax_callback' );
add_action( 'wp_ajax_nopriv_my_ajax_action', 'my_ajax_callback' );



function add_myjavascript(){
    wp_enqueue_script( 'ajax-implementation.js', get_template_directory_uri() . '/js/ajax-implementation.js', array( 'jquery' ) );
    wp_localize_script( 'ajax-implementation.js', 'my_ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );
  }
  add_action( 'wp_enqueue_scripts', 'add_myjavascript' );

  

?>


