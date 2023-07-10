jQuery(document).ready(function(){

    jQuery("#link a").css({
        
        "text-decoration": "none",
        "color":"red"
        
    });
    
    /* for one click */
    jQuery('.box-two-one').click(function(){
        /* var footerBox = jQuery('.box-two-one').html();
        console.log(footerBox); */
        jQuery('.box-two-one').css('background-color','#43A6C6')
    });
    /* for double click */
    jQuery('.box-two-one').dblclick(function(){
        jQuery('.box-two-one').css('background-color','#296E85')
    });
    /* for right click */
    jQuery('.box-two-one').contextmenu(function(){
        jQuery('.box-two-one').css('background-color','#900C3F')
    });
    /* When hover the courser or mouse */
    jQuery('.box-two-one').mouseenter(function(){
        jQuery('.box-two-one').css('background-color','#581845')
    });
    /* When mouse leave */
    jQuery('.box-two-one').mouseleave(function(){
        jQuery('.box-two-one').css('background-color','#DAF7A6')
    });
});

/* Keyboard Events */
// jQuery(document).ready(function(){
    /* When press any keyboard button */
    // jQuery('body').keypress(function(){
    //     jQuery(this).css('background-color','orange');
    // });
    /* When remove the press button */
    // jQuery('body').keyup(function(){
    //     jQuery(this).css('background-color','#51FFC5');
    // });
    
// });

/* form Events */
jQuery(document).ready(function(){
/* form Events when focus color will be change means when click on field color will be change*/
    jQuery('#login__username').focus(function(){
        jQuery(this).css('background-color','wheat');
    });
    /* when remove focus what happen */
    jQuery('#login__username').blur(function(){
        jQuery(this).css('background-color','#E7F2F8');
    });
    /* Its operate with select box  */
    jQuery('#login__username').change(function(){
        jQuery(this).css('background-color','#E7F2F8');
    });
    /* When select text */
    jQuery('#login__username').select(function(){
        jQuery(this).css('background-color','blue');
    });
    
    jQuery('#form').submit(function(){
        // jQuery(this).css('background-color','#FFA384');
        alert("form submit");
    });
});

/* Windows Events start*/
jQuery(document).ready(function(){
    jQuery('.box-two-two').scroll(function(){
        console.log("scrolling");
    });
}); 

jQuery(window).scroll(function(){
    console.log("resize");
});
/* Windows Events End*/

/* Get methods start*/
jQuery(document).ready(function(){
    /* To display specific element like p,body it display span other other element with text*/
    var a = jQuery('.box-two-one').html();
    console.log(a);

    /* It only display the text of paragraph */
    var a = jQuery('.box-two-one p').text();
    console.log(a);

    /* To get attribute of element */
    var a = jQuery('.box-two-one').attr('id');
    console.log(a);

    /* To get the value of form */
    jQuery('#form').submit(function(){
        var name = jQuery('.form__input').val();
        var pass = jQuery('.form__input').val();
        alert(name);

    });
});
/* Get methods End*/

/* To set method start */
jQuery(document).ready(function(){
    /* This is used for set text only on click */
    jQuery('#clickbutton').click(function(){
        jQuery('#secondBox h2').text("It is fun");

        /* This is for html */
        jQuery('#secondBox p').html("It is fun <b>and</b> now i am learning jQuery");

        /* This is used for set attribute */
        jQuery('#secondBox h2').attr("class","red");
 
    });
    /* for seting the value like placeholder using jQuery  */
    jQuery('#login__username').val('faheem');
    jQuery('#login__password').val("1234");
});

jQuery(document).ready(function(){
    
});
/* To set method End */


/* to hide any element start*/
jQuery(document).ready(function(){
    jQuery("p").click(function(){
        jQuery(this).hide();
    });
});
/* to hide any element End*/


/* Css class method start*/
jQuery(document).ready(function(){
    jQuery("#addbutton").click(function(){
        jQuery('.box-third').addClass('red');
    });
    jQuery("#removebutton").click(function(){
        jQuery('.box-third').removeClass('red');
    });
    jQuery("#togglebutton").click(function(){
        jQuery(".box-third").toggleClass("red");
    });
});
/* Css class method End*/


/* jQuery on() and off() method start :- It is used for include more than one events */
jQuery(document).ready(function(){
    jQuery('.box-forth-two').on("click",function(){
        jQuery(this).css('background','orange');
    });

    /* for toggle with two function mouseover mouseout */
    jQuery('.box-forth-two').on("mouseover mouseout",function(){
        jQuery(this).toggleClass('red');
    });

   /*  jQuery('.box-forth-two').on({
        "click":function(){
            jQuery(this).css("background","#400000")
        },
        "mouseover":function(){
            jQuery(this).css("background","pink");
        },
        "mouseout": function(){
            jQuery(this).css("background","wheat")
        }
    }); */

    /* off() i understand  */
    jQuery('button').click(function(){
        jQuery('.box-forth-two').off("mouseover mouseout");
    });

});
/* jQuery on() and off() method End */



/* Append and prepend function using jQuery start*/
jQuery(document).ready(function(){
    /* Append function add text in bottom like danish*/
    jQuery('#appendbutton').click(function(){
        jQuery('.box-third').append("<h2>Danish</h2>");
    });
    
    /* prepend function add text on top */
    jQuery('#prependbutton').click(function(){
        jQuery('.box-third').prepend("<h3>Danish</h3>");
    });
});
/* Append and prepend function using jQuery End*/


/* jQuery after() and before() start */
jQuery(document).ready(function(){
    /* for include heading outside box */
    jQuery('#afterbutton').click(function(){
        jQuery('.box-third').after('<h3>Heading</h3>');
    });

    jQuery('#beforebutton').click(function(){
        // jQuery('.box-third').after('<h3>Heading</h3>');
        jQuery('#beforebutton').after('<h3>footer</h3>');
    });
});


/* jQuery after() and before() End */





/* Empty() and Remove method in jQuery start */
jQuery(document).ready(function(){
    /* it does not remove elements like div h2 */
    jQuery('#emptybutton').click(function(){
        jQuery('.box-third').empty();
    });
    
    /* It remove elements with content */
    jQuery('#removebtnbutton').click(function(){
        jQuery('.box-third').remove();
    });
});
/* Empty() and Remove method in jQuery End */







/* Clone method using jQuery start*/
jQuery(document).ready(function(){
    jQuery('#clonebutton').click(function(){
        jQuery('.box-third h2').clone().prependTo('.box-forth-two');
    });
});
/* Clone method using jQuery End*/



/* ReplaceAll and ReplaceWith method start */
jQuery(document).ready(function(){
    /* replace first child of paragraph with replacewith text   */
    jQuery('#replacebutton').click(function(){
        jQuery('.box-third p:first').replaceWith('<h3>jQuery is nice</h3>');
    });
    /* Replace all p tag with this field */
    jQuery('#replaceallbutton').click(function(){
        jQuery('<h3>jQuery is nice it is fun to learn</h3>').replaceAll('.box-third p');
    });


});

/* Replace all method End */





/* wrap() and unwrap() start */
jQuery(document).ready(function(){
    /* for bold the the p tag it wrap text in h2 tag */
    jQuery('#wrapbutton').click(function(){
        jQuery('.box-third p').wrap('<h2></h2>');
    });

    /* for  unwrap the content*/
    jQuery('#unwrapbutton').click(function(){
        jQuery('.box-third p').unwrap();
    });
});
/* wrap() and unwrap() end */

// same at is it wrap()
/* Wrapall() and wrapinner() */




/* jQuery width and height start */
jQuery(document).ready(function(){
    /* Width  */
    jQuery('#widthbutton').click(function(){
        console.log("width :" + jQuery('.box-third').width());
        console.log("Innerwidth :" + jQuery('.box-third').innerWidth());
        console.log("Outerwidth :" + jQuery('.box-third').outerWidth());
        // console.log("outerwidth :" + jQuery('.box-third').outerwidth());
    });

    /* height */
    jQuery('#heightbutton').click(function(){
        console.log("Height :" + jQuery('.box-third').height());
        console.log("InnerHeight :" + jQuery('.box-third').innerHeight());
        console.log("OuterHeight :" + jQuery('.box-third').outerHeight());
        // console.log("outerwidth :" + jQuery('.box-third').outerwidth());
    });


});
/* jQuery width and height end */




/* jQuery Position method like offset and position start */
jQuery(document).ready(function(){
    /* For postion of box it return two value left and top in px */
    jQuery('#positionbutton').click(function(){
        console.log(jQuery('.box-third').position());
    });
    
    /* For offset box it return two value left and top in px */
    jQuery('#offsetbutton').click(function(){
        console.log(jQuery('.box-third').offset({top:100,left:100}));
    });
    
    jQuery('#positionbutton').click(function(){
        console.log(jQuery('.box-third p').position());
    });
    
    /* For offset it return two value left and top in px */
    jQuery('#offsetbutton').click(function(){
        var x = jQuery('.box-third p').offset();
        console.log("Top : " + x.top + "left : x.left");
    });
});
/* jQuery Position method End */


/* ScrollTop and scrollLeft method start*/
jQuery(document).ready(function(){
    jQuery(window).scrollTop();
    jQuery(window).scrollLeft();
});
/* ScrollTop and scrollLeft method End*/




/* hasClass method in jQuery start */
/* Has class not working */
jQuery(document).ready(function(){
    jQuery('.abc').click(function(){
        // console.log('Every One');
        var x = jQuery('#third').hasClass('box-third');
        
        if(x == true){
            console.log('Yes');
        }else{
            console.log('NO');
        }
    });
});
/* hasClass method in jQuery End */





/* Hide show and toggle method in jQuery start */
jQuery(document).ready(function(){
    /* To hide the content we also pass the paramete in hide function like hide('slow') */
    jQuery('#hidebutton').click(function(){
        jQuery('.box-third').hide("slow");
    });

    /* To show the content we also pass the paramete in hide function like show() */
    jQuery('#showbutton').click(function(){
        jQuery('.box-third').show("slow");
    });
});
/* Hide show and toggle method in jQuery End */
































































