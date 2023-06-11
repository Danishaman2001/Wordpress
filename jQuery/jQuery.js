$(document).ready(function(){
    $("#link a").css({
        "text-decoration": "none",
        "color":"red"
    });
    /* for one click */
    $('.box-two-one').click(function(){
        /* var footerBox = $('.box-two-one').html();
        console.log(footerBox); */
        $('.box-two-one').css('background-color','#43A6C6')
    });
    /* for double click */
    $('.box-two-one').dblclick(function(){
        $('.box-two-one').css('background-color','#296E85')
    });
    /* for right click */
    $('.box-two-one').contextmenu(function(){
        $('.box-two-one').css('background-color','#900C3F')
    });
    /* When hover the courser or mouse */
    $('.box-two-one').mouseenter(function(){
        $('.box-two-one').css('background-color','#581845')
    });
    /* When mouse leave */
    $('.box-two-one').mouseleave(function(){
        $('.box-two-one').css('background-color','#DAF7A6')
    });
});

/* Keyboard Events */
$(document).ready(function(){
    /* When press any keyboard button */
    $('body').keypress(function(){
        $(this).css('background-color','orange');
    });
    /* When remove the press button */
    $('body').keyup(function(){
        $(this).css('background-color','#51FFC5');
    });
    
});

/* form Events */
$(document).ready(function(){
/* form Events when focus color will be change means when click on field color will be change*/
    $('#login__username').focus(function(){
        $(this).css('background-color','wheat');
    });
    /* when remove focus what happen */
    $('#login__username').blur(function(){
        $(this).css('background-color','#E7F2F8');
    });
    /* Its operate with select box  */
    $('#login__username').change(function(){
        $(this).css('background-color','#E7F2F8');
    });
    /* When select text */
    $('#login__username').select(function(){
        $(this).css('background-color','blue');
    });
    
    $('#form').submit(function(){
        // $(this).css('background-color','#FFA384');
        alert("form submit");
    });
});

/* Windows Events start*/
$(document).ready(function(){
    $('.box-two-two').scroll(function(){
        console.log("scrolling");
    });
}); 

$(window).scroll(function(){
    console.log("resize");
});
/* Windows Events End*/

/* Get methods start*/
$(document).ready(function(){
    /* To display specific element like p,body it display span other other element with text*/
    var a = $('.box-two-one').html();
    console.log(a);

    /* It only display the text of paragraph */
    var a = $('.box-two-one p').text();
    console.log(a);

    /* To get attribute of element */
    var a = $('.box-two-one').attr('id');
    console.log(a);

    /* To get the value of form */
    $('#form').submit(function(){
        var name = $('.form__input').val();
        var pass = $('.form__input').val();
        alert(name);

    });
});
/* Get methods End*/

/* To set method start */
$(document).ready(function(){
    /* This is used for set text only on click */
    $('#clickbutton').click(function(){
        $('#secondBox h2').text("It is fun");

        /* This is for html */
        $('#secondBox p').html("It is fun <b>and</b> now i am learning jQuery");

        /* This is used for set attribute */
        $('#secondBox h2').attr("class","red");
 
    });
    /* for seting the value like placeholder using jQuery  */
    $('#login__username').val('faheem');
    $('#login__password').val("1234");
});

$(document).ready(function(){
    
});
/* To set method End */


/* to hide any element start*/
$(document).ready(function(){
    $("p").click(function(){
        $(this).hide();
    });
});
/* to hide any element End*/


/* Css class method start*/
$(document).ready(function(){
    $("#addbutton").click(function(){
        $('.box-third').addClass('red');
    });
    $("#removebutton").click(function(){
        $('.box-third').removeClass('red');
    });
    $("#togglebutton").click(function(){
        $(".box-third").toggleClass("red");
    });
});
/* Css class method End*/


/* jQuery on() and off() method start :- It is used for include more than one events */
$(document).ready(function(){
    $('.box-forth-two').on("click",function(){
        $(this).css('background','orange');
    });

    /* for toggle with two function mouseover mouseout */
    $('.box-forth-two').on("mouseover mouseout",function(){
        $(this).toggleClass('red');
    });

   /*  $('.box-forth-two').on({
        "click":function(){
            $(this).css("background","#400000")
        },
        "mouseover":function(){
            $(this).css("background","pink");
        },
        "mouseout": function(){
            $(this).css("background","wheat")
        }
    }); */

    /* off() i understand  */
    $('button').click(function(){
        $('.box-forth-two').off("mouseover mouseout");
    });

});
/* jQuery on() and off() method End */



/* Append and prepend function using jQuery start*/
$(document).ready(function(){
    /* Append function add text in bottom like danish*/
    $('#appendbutton').click(function(){
        $('.box-third').append("<h2>Danish</h2>");
    });
    
    /* prepend function add text on top */
    $('#prependbutton').click(function(){
        $('.box-third').prepend("<h3>Danish</h3>");
    });
});
/* Append and prepend function using jQuery End*/


/* jQuery after() and before() start */
$(document).ready(function(){
    /* for include heading outside box */
    $('#afterbutton').click(function(){
        $('.box-third').after('<h3>Heading</h3>');
    });

    $('#beforebutton').click(function(){
        // $('.box-third').after('<h3>Heading</h3>');
        $('#beforebutton').after('<h3>footer</h3>');
    });
});


/* jQuery after() and before() End */





/* Empty() and Remove method in jQuery start */
$(document).ready(function(){
    /* it does not remove elements like div h2 */
    $('#emptybutton').click(function(){
        $('.box-third').empty();
    });
    
    /* It remove elements with content */
    $('#removebtnbutton').click(function(){
        $('.box-third').remove();
    });
});
/* Empty() and Remove method in jQuery End */







/* Clone method using jQuery start*/
$(document).ready(function(){
    $('#clonebutton').click(function(){
        $('.box-third h2').clone().prependTo('.box-forth-two');
    });
});
/* Clone method using jQuery End*/



/* ReplaceAll and ReplaceWith method start */
$(document).ready(function(){
    /* replace first child of paragraph with replacewith text   */
    $('#replacebutton').click(function(){
        $('.box-third p:first').replaceWith('<h3>jQuery is nice</h3>');
    });
    /* Replace all p tag with this field */
    $('#replaceallbutton').click(function(){
        $('<h3>jQuery is nice it is fun to learn</h3>').replaceAll('.box-third p');
    });


});

/* Replace all method End */





/* wrap() and unwrap() start */
$(document).ready(function(){
    /* for bold the the p tag it wrap text in h2 tag */
    $('#wrapbutton').click(function(){
        $('.box-third p').wrap('<h2></h2>');
    });

    /* for  unwrap the content*/
    $('#unwrapbutton').click(function(){
        $('.box-third p').unwrap();
    });
});
/* wrap() and unwrap() end */

// same at is it wrap()
/* Wrapall() and wrapinner() */




/* jQuery width and height start */
$(document).ready(function(){
    /* Width  */
    $('#widthbutton').click(function(){
        console.log("width :" + $('.box-third').width());
        console.log("Innerwidth :" + $('.box-third').innerWidth());
        console.log("Outerwidth :" + $('.box-third').outerWidth());
        // console.log("outerwidth :" + $('.box-third').outerwidth());
    });

    /* height */
    $('#heightbutton').click(function(){
        console.log("Height :" + $('.box-third').height());
        console.log("InnerHeight :" + $('.box-third').innerHeight());
        console.log("OuterHeight :" + $('.box-third').outerHeight());
        // console.log("outerwidth :" + $('.box-third').outerwidth());
    });


});
/* jQuery width and height end */




/* jQuery Position method like offset and position start */
$(document).ready(function(){
    /* For postion of box it return two value left and top in px */
    $('#positionbutton').click(function(){
        console.log($('.box-third').position());
    });
    
    /* For offset box it return two value left and top in px */
    $('#offsetbutton').click(function(){
        console.log($('.box-third').offset({top:100,left:100}));
    });
    
    $('#positionbutton').click(function(){
        console.log($('.box-third p').position());
    });
    
    /* For offset it return two value left and top in px */
    $('#offsetbutton').click(function(){
        var x = $('.box-third p').offset();
        console.log("Top : " + x.top + "left : x.left");
    });
});
/* jQuery Position method End */


/* ScrollTop and scrollLeft method start*/
$(document).ready(function(){
    $(window).scrollTop();
    $(window).scrollLeft();
});
/* ScrollTop and scrollLeft method End*/




/* hasClass method in jQuery start */
/* Has class not working */
$(document).ready(function(){
    $('.abc').click(function(){
        // console.log('Every One');
        var x = $('#third').hasClass('box-third');
        
        if(x == true){
            console.log('Yes');
        }else{
            console.log('NO');
        }
    });
});
/* hasClass method in jQuery End */





/* Hide show and toggle method in jQuery start */
$(document).ready(function(){
    /* To hide the content we also pass the paramete in hide function like hide('slow') */
    $('#hidebutton').click(function(){
        $('.box-third').hide("slow");
    });

    /* To show the content we also pass the paramete in hide function like show() */
    $('#showbutton').click(function(){
        $('.box-third').show("slow");
    });
});
/* Hide show and toggle method in jQuery End */