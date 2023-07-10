<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'unthinkable' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'password' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'yZL<|a9hCody~B0>ubRG6Op1;Y!KH)lr9ZHU{i3UR^`Xki!cHEU#AL7fR)k>}T5_' );
define( 'SECURE_AUTH_KEY',  '(=tg@(6q>YMBdN*~8`WT%`6H3V>pc}RPV],|VN&:o|l9R1x`iNudg7xC~`aD5og=' );
define( 'LOGGED_IN_KEY',    'IPvt|$6msZoF/T9o/h(Z6R_,=bYC}GSB~ztQ/{=gVh7MZ&cv:/}SFn{5][lGz,rF' );
define( 'NONCE_KEY',        'FI:tt.5;`EW;[qK6OM_zzrorYo84B)0&N~;)BjRo4}6Zw7yLphCH#]x7+n~WnZMi' );
define( 'AUTH_SALT',        'ud./FNu.aRfGcS!jws0WW^-wxu7H:7I?oE.]7 /4wg(P|(nacF9L2iOW-eI/jU*&' );
define( 'SECURE_AUTH_SALT', 'j6w^]!sZ!^2JIin7oM5r:ht0HA]z]VyRiX,UB)YH4h%5:hZbPt8I[LV%?1sseSyU' );
define( 'LOGGED_IN_SALT',   'f/Mi{LeIg(?<|*vnH,|Y76E@gC`qNsM=kfw<?6?*=ns$oAgzi97wX`)Z9?a:L{d;' );
define( 'NONCE_SALT',       'T]!MJ*v6)~0yjSNUJtc[1bIDVU#Sv]E*kcn(s5qR5F#^6mb@D`2$?2/o4(<5l]`Q' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';


/* I am adding this */
// define( 'DISABLE_WP_CRON', true );