//  console.log("There shouldn't be any errors down here, but if there are they were totally on purpose. And while I didn't add it to my portfolio, I made this site by building on a Bootstrap template. The space and water images are from unsplash.com, but I made pretty much all the icons and the top logo. Cheers. -Joshua Smith")

// collapse the navbar on scroll
window.addEventListener('scroll', function() {
    if (document.documentElement.scrollTop > 50) {
        navbar.classList.add('top-nav-collapse');
    } else {
        navbar.classList.remove('top-nav-collapse');
    }
});
const move = function(elem, bottom) {
    setTimeout(function() {
        bottom += 10;
        elem.style.bottom = bottom + 'px';
        if (bottom < 500) {
            move(elem, bottom);
        } else {
            elem.parentNode.remove();
        }
    }, 5);
};
document.addEventListener('DOMContentLoaded', function() { 
    processJSONContent();
    var shipX = 0;
    var shipM = 0;

    document.getElementById('portfolio').addEventListener('mousemove', function(e) {
        shipX = e.pageX;
        var buff = $(window).width()/8;
        shipM = (shipX - buff);
        document.getElementById('ship').style.marginLeft = shipM + 'px';
    });

    [].forEach.call(document.getElementsByClassName('mod-link'), function(el) {
        el.addEventListener('click', function() {
            const ship = document.getElementById('ship-bound');
            const bullet = document.createElement('div');
            bullet.setAttribute('class', 'bullet');
            bullet.setAttribute('style', 'left:' + (shipM + 52)  + 'px;');
            // const bulletString = '<div id="bullet" class="bullet" style="left:' + (shipM + 52)  + 'px;"></div>';
            ship.appendChild(bullet);
            move(bullet, 0);
        });
    });
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