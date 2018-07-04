/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */
// $(window).on('beforeunload', function() {
//     // $(window).scrollTop(0);
// });
//  console.log("There shouldn't be any errors down here, but if there are they were totally on purpose. And while I didn't add it to my portfolio, I made this site by building on a Bootstrap template. The space and water images are from unsplash.com, but I made pretty much all the icons and the top logo. Cheers. -Joshua Smith")

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

$(document).ready(function(){

    var shipX = 0;
    var shipM = 0;
    var bCount = 0;

    var tallness = $(window).height();
    $('#buffer-fix').css('min-height', (tallness/2.2));
    
    $(window).resize(function() {
        var tallness = $(window).height();
        $('#buffer-fix').css('min-height', (tallness/2.2));
    });

    $(window).mousemove(function(e){
        shipX = e.pageX;
        var buff = $(window).width()/8;
        shipM = (shipX - buff);
        $('#ship').css('margin-left', shipM );
    })

    $('.mod-link').click(function(){
        $('#ship-bound').append('<div id="bullet" class="bullet" style="left:' + (shipM + 52)  + 'px;"></div>');
        $('.bullet').animate({
            bottom : 600
          }, 300, function() {
            // Animation complete.
            $('#bullet').remove()
          });
    })

    processJSONContent();
});

const insertAfter = function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

const domSwap = function(nodeString, referenceNode) {
    const tempNode = document.createElement('span');
    tempNode.innerHTML = nodeString;
    const newNode = tempNode.firstElementChild;
    insertAfter(newNode, referenceNode);
};


const injectInDom = function(item) {
    [].forEach.call(document.querySelectorAll('[data-replace="' + item.type + '"]'), (element) => {
        domSwap(item.content, element);
    });
};

const makeTag = function(key) {
    return '{{' + key + '}}';
};

const iterateTemplateContent = function(wrapper, templateData, templateChunk) {
    const chunkString = templateChunk.outerHTML;
    templateData.forEach(function(content) {
        let stringCopy = chunkString;
        Object.keys(content).forEach(function(contentKey) {
            stringCopy = stringCopy.replace(makeTag(contentKey), content[contentKey]);
        });
        stringCopy.replace('data-iterate', '');
        domSwap(stringCopy, templateChunk);
    });
    templateChunk.remove();
};

const renderTemplate = function(templateData) {
    const wrapper= document.createElement('div');
    wrapper.innerHTML=  document.querySelector('[data-template="' + templateData.dataTemplate + '"]').innerHTML;
    Object.keys(templateData.content).forEach(function(contentKey) {
        const templateChunk = wrapper.querySelector('[data-iterate="' + contentKey + '"]');
        iterateTemplateContent(wrapper, templateData.content[contentKey], templateChunk);
    });
    [].forEach.call(document.querySelectorAll('[data-replace="' + templateData.dataTemplate + '"]'), (element) => {
        insertAfter(wrapper, element);
    });
};

const processJSONContent = function() {
    dataReplace.forEach((item) => {
        if (item.dataTemplate) {
            renderTemplate(item);
        } else {
            injectInDom(item);
        }
    });
};