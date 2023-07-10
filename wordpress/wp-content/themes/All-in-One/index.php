
<!DOCTYPE html>
<html>
  <head>
    <title>My Webpage</title>
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"> -->
    <!-- Sass Compiler -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.13/sass.min.js"></script> -->




    
    <?php wp_head() ?>
  </head>
  <body>
    <header class="header" id="head">
      <div class="logo">
        <img src="logo.png" alt="Logo">
      </div>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
            <!-- search bar start -->
                <form class="search-form ">
                    <input type="text" placeholder="Search here for excited location">
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>    
            <!-- Searchbar End -->      
      </nav>
      <div class="header-content">
        <h1>Welcome to our website</h1>
        <p>Learn more about our services and products</p>
        <button>Get started</button>
      </div>
      <div class="header-grid">
        <div class="grid-item">Grid item 1</div>
        <div class="grid-item">Grid item 2</div>
        <div class="grid-item">Grid item 3</div>
        <div class="grid-item">Grid item 4</div>
      </div>
      
    </header>
    <div class="container-tabs">
    <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#tab1"><img class="i181yxiv dir dir-ltr" src="https://a0.muscache.com/pictures/aaa02c2d-9f0d-4c41-878a-68c12ec6c6bd.jpg" alt="" width="30" height="30">
            <div class="font" style="font-size:12px;">Farms</div>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#tab2"><img class="i181yxiv dir dir-ltr" src="https://a0.muscache.com/pictures/aaa02c2d-9f0d-4c41-878a-68c12ec6c6bd.jpg" alt="" width="30" height="30"></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#tab3"><img class="i181yxiv dir dir-ltr" src="https://a0.muscache.com/pictures/aaa02c2d-9f0d-4c41-878a-68c12ec6c6bd.jpg" alt="" width="30" height="30"></a>
        </li>
        <!-- Add more <li> elements for additional tabs -->
    </ul>

    <div class="tab-content">
        <div id="tab1" class="container tab-pane active">
            <h4><img class="i181yxiv dir dir-ltr" src="https://a0.muscache.com/pictures/aaa02c2d-9f0d-4c41-878a-68c12ec6c6bd.jpg" alt="" width="30" height="30"></h4>
        </div>
        <div id="tab2" class="container tab-pane fade">
            <h4>2</h4>
        </div>
        <div id="tab3" class="container tab-pane fade">
            <h4>3</h4>
        </div>
        <!-- Add more <div> elements with unique IDs for additional tab content -->
    </div>
</div>
    <div class="owl-carousel owl-theme">
    <div class="item"><h4>1</h4></div>
    <div class="item"><h4>2</h4></div>
    <div class="item"><h4>3</h4></div>
    <div class="item"><h4>4</h4></div>
    <div class="item"><h4>5</h4></div>
    <div class="item"><h4>6</h4></div>
    <div class="item"><h4>7</h4></div>
    <div class="item"><h4>8</h4></div>
    <div class="item"><h4>9</h4></div>
    <div class="item"><h4>10</h4></div>
    <div class="item"><h4>11</h4></div>
    <div class="item"><h4>12</h4></div>
</div>

<script src="path/to/jquery.min.js"></script>
<script src="path/to/owl.carousel.min.js"></script>
<script>
    $(document).ready(function(){
        $('.owl-carousel').owlCarousel({
            items: 1,
            loop: true,
            margin: 10,
            autoplay: true,
            autoplayTimeout: 2000,
            autoplayHoverPause: true
        });
    });
</script>


    <main>
        <div class="box-container" id="container-box">
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
          </div>          
        <h1>My Grid Layout</h1>
        <div class="grid-container" id="container-grid">
            <div class="grid-item">1</div>
            <div class="grid-item">2</div>
            <div class="grid-item">3</div>
            <div class="grid-item">4</div>
            <div class="grid-item">5</div>
            <div class="grid-item">6</div>
        </div>
        <h1>My Flexbox Layout</h1>
        <div class="flex-container">
            <div class="flex-item section-1">
                <h2>Section 1</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor bibendum sapien, id sollicitudin leo hendrerit in. Nam sagittis blandit metus, eget tristique nisi vulputate ut. Nam auctor mauris vel lectus pellentesque, in interdum ex malesuada. </p>
            </div>
            <div class="flex-item section-2">
                <h2>Section 2</h2>
                <p>Curabitur sodales enim quis nulla faucibus, ac venenatis leo consectetur. Donec finibus magna libero, in semper nisl lacinia eu. Aliquam nec risus nec mauris consectetur iaculis. Duis viverra mauris quam, eu congue velit lacinia id.</p>
            </div>
            <div class="flex-item section-3">
                <h2>Section 3</h2>
                <p>Mauris sed lobortis lectus, sit amet ultrices massa. Praesent at ultrices nisi. Integer aliquet malesuada mi, vitae convallis urna molestie nec. Nam tristique felis sit amet tellus molestie, at lacinia purus fringilla. </p>
            </div>
        </div>
        <h1>My Content with Sidebar</h1>
        <div class="content-wrapper">
            <div class="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor bibendum sapien, id sollicitudin leo hendrerit in. Nam sagittis blandit metus, eget tristique nisi vulputate ut. Nam auctor mauris vel lectus pellentesque, in interdum ex malesuada.</p>
            <p>Curabitur sodales enim quis nulla faucibus, ac venenatis leo consectetur. Donec finibus magna libero, in semper nisl lacinia eu. Aliquam nec risus nec mauris consectetur iaculis. Duis viverra mauris quam, eu congue velit lacinia id.</p>
            <p>Mauris sed lobortis lectus, sit amet ultrices massa. Praesent at ultrices nisi. Integer aliquet malesuada mi, vitae convallis urna molestie nec. Nam tristique felis sit amet tellus molestie, at lacinia purus fringilla.</p>
            </div>
            <div class="sidebar">
            <h2>Sidebar</h2>
            <ul>
                <li>Link 1</li>
                <li>Link 2</li>
                <li>Link 3</li>
                <li>Link 4</li>
            </ul>
            </div>
        </div> 
        <div class="container-last">
            <div class="row-last">
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
            </div>
            <div class="row-last">
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
            </div>
            <div class="row-last">
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
              <div class="box-last"></div>
            </div>
        </div>
            <div class="container-two">
                <div class="box-two-one" id="secondBox">
                    <h2>Box 1</h2>
                    <p>Lorem ipsum dolor sit amet, <span>consectetur adipiscing</span> elit. Ut non ex non mauris feugiat posuere sit amet ac magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                    <button id="clickbutton">Set Value</button>
                </div>
                <div class="box-two-two">
                    <h2>Box 2</h2>
                    <p>Sed aliquet massa a nisl imperdiet, eget finibus ex venenatis. Sed sit amet arcu lobortis, posuere sapien a, sollicitudin mi. In ut tortor in purus cursus egestas. Donec laoreet vulputate dui, nec vestibulum dolor vestibulum a. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa dolore maiores, pariatur, debitis temporibus, tenetur tempore eaque porro minima autem corporis quisquam cum exercitationem facere? Veritatis tempora ipsam officia itaque.
                    Fuga optio exercitationem esse hic voluptate reprehenderit nisi, harum, qui quisquam minima, sint corporis impedit. Nobis, ex amet. At provident rerum corporis dicta tenetur, totam id a? Tempora, cupiditate distinctio?
                    Facilis, debitis? Ipsa perspiciatis enim repellat nobis, atque libero quidem ad magnam voluptates. Eos dicta velit id, labore eius quos facilis asperiores laborum provident error tempora minus dolores facere ex?</p>
                
                </div>
                
            </div>
            <div class="container-two">
                <div class="box-third" id="third">
                    <h2>Box 3</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore iure, sed qui deserunt ipsam earum placeat nulla asperiores debitis repellat sapiente laudantium nobis id sequi repudiandae dolorum minima esse similique.</p>
                    
                </div>
                
              <div class="box-forth-two" id="forth">
                <h2>Box 4</h2>
                <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit obcaecati sequi ullam exercitationem natus deleniti fugiat dolores eos explicabo ipsa, rem pariatur expedita nesciunt quidem adipisci ex itaque voluptate culpa.</p>
                <button>Remove Event</button>
              </div>
            </div>
            <button id="addbutton">Add Css</button>
            <button id="removebutton">Remove Css</button>
            <button id="togglebutton">Toggle Css</button>
            <button id="appendbutton">Append</button>
            <button id="prependbutton">Prepend</button>
            <button id="afterbutton">After</button>
            <button id="beforebutton">Before</button>
            <button id="emptybutton">Empty</button>
            <button id="removebtnbutton">Remove</button>
            <button id="clonebutton">Clone</button>
            <button id="replacebutton">Replace</button>
            <button id="replaceallbutton">Replace All</button>
            <button id="wrapbutton">Wrap</button>
            <button id="unwrapbutton">unwrap</button>
            <button id="wrapallbutton">wrapall</button>
            <button id="wrapinnerbutton">wrapinner</button>
            <button id="widthbutton">Width</button>
            <button id="heightbutton">Height</button>
            <button id="positionbutton">Position</button>
            <button id="offsetbutton">Offset</button>
            <button id="hasbutton" class="abc">hasClass</button>
            <button id="hidebutton">Hide</button>
            <button id="showbutton">Show</button>
            <!-- Login form start -->
            <div class="login">       
                <div class="grid">

                    <form action="" method="POST" class="form login" id="form">

                    <div class="form__field">
                        <label  for="login__username"><svg class="icon">
                            <use xlink:href="#icon-user"></use>
                        </svg><span class="hidden">Username</span></label>
                        <input autocomplete="username" id="login__username" type="text" name="username" class="form__input" placeholder="Username">
                    </div>

                    <div class="form__field">
                        <label class="spassword" for="login__password"><svg class="icon">
                            <use xlink:href="#icon-lock"></use>
                        </svg><span class="hidden">Password</span></label>
                        <input id="login__password" type="password" name="password" class="form__input" placeholder="Password">
                    </div>

                    <div class="form__field">
                        <input type="submit" value="Sign In" class="submit">
                    </div>

                    </form>
                    

                    <p class="text--center">Not a member? <a href="#">Sign up now</a> <svg class="icon">
                        <use xlink:href="#icon-arrow-right"></use>
                    </svg></p>
                    

                </div>

                <form class="getresponse" action="https://app.getresponse.com/add_subscriber.html" accept-charset="utf-8" method="post">

                <svg xmlns="http://www.w3.org/2000/svg" class="icons">
                    <symbol id="icon-arrow-right" viewBox="0 0 1792 1792">
                    <path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" />
                    </symbol>
                    <symbol id="icon-lock" viewBox="0 0 1792 1792">
                    <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
                    </symbol>
                    <symbol id="icon-user" viewBox="0 0 1792 1792">
                    <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
                    </symbol>
                </svg>
            </div>

            <?php //echo do_shortcode('[mysecond]');?>
            <div>
                <?php echo do_shortcode('[custom_form]');?>
            </div>
            
        <footer class="footer" id="last-footer">
            <div class="container">
                <div class="row">
                <div class="col-md-4">
                    <h4>Company Name</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales ante eget dolor vestibulum, et tristique sapien aliquet.</p>
                </div>
                <div class="col-md-4">
                    <h4>Links</h4>
                    <ul class="footer-list" id="link">
                        <li><a href="#">Home</a></li>
                        <li class="foo"><a href="#">About Us</a></li>
                        <li><a href="#">Services</a></li>
                        <li class="foo"><a href="#">Contact Us</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h4>Contact Us</h4>
                    <p>123 Main Street, City, State ZIP</p>
                    <p>Phone: (123) 456-7890</p>
                    <p>Email: info@company.com</p>
                </div>
                </div>
                <div class="row">
                <div class="col-md-12">
                    <hr>
                    <p class="text-center">&copy; 2023 Company Name. All Rights Reserved.</p>
                </div>
                </div>
            </div>
        </footer>       
        <div>
        
        </div>
    </main>
    
  </body>
</html>
<?php 
wp_footer();
?>