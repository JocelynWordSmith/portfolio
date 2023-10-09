// TODO: move all of this into seperate JSON content files
const dataReplace = [{
    "type": "contact-link",
    "content": "<li><a href=\"mailto:jocelyn.willwork@gmail.com\" class=\"btn btn-default btn-lg\"><i class=\"fa fa-envelope fa-fw\"></i><span class=\"network-name\">Contact Jocelyn</span></a></li>"
}, {
    "type": "close-button",
    "content": "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"
}, {
    "dataTemplate": "navbar-main-collapse",
    "content": {
        "listItem": [{
            "href": "about",
            "text": "About"
        }, {
            "href": "portfolio",
            "text": "Portfolio"
        }, {
            "href": "work-history",
            "text": "Work History"
        }, {
            "href": "contact",
            "text": "Contact"
        }]
    }
}, {
    "dataTemplate": "contact-section",
    "content": {
        "listItem": [{
            "href": "mailto:jocelyn.willwork@gmail.com",
            "icon": "envelope",
            "text": "Email"
        }, {
            "href": "https://github.com/JocelynWordSmith",
            "icon": "github",
            "text": "Github"
        }, {
            "href": "https://www.linkedin.com/in/jocelyn-smith-she-her-a16355109",
            "icon": "linkedin",
            "text": "LinkedIn"
        }],
        "signoff": [{
            "header": "Contact Jocelyn Smith",
            "copy1": "Whether you liked anything enough to talk about working together, or hated anything enough that you need to let me know, I look forward to hearing from you.",
            "copy2": "References and sweet drum solos available upon request."
        }]
    }
}, {
    "dataTemplate": "skills-modal",
    "content": {
        "skillIcon": [{
            "src": "img/bow.png",
            "text": "JavaScript"
        }, {
            "src": "img/net.png",
            "text": "Python3"
        }, {
            "src": "img/boomerang.png",
            "text": "React"
        }, {
            "src": "img/bomb.png",
            "text": "Jenkins"
        }, {
            "src": "img/lantern.png",
            "text": "Pandas"
        }, {
            "src": "img/heart-container-3-4.png",
            "text": "Redux"
        }, {
            "src": "img/boss-key.png",
            "text": "Unit testing"
        }, {
            "src": "img/sword-down.png",
            "text": "CI/CD"
        }, {
            "src": "img/chest.png",
            "text": "Webpack"
        }, {
            "src": "img/red-pot.png",
            "text": "Bash/Zsh"
        }, {
            "src": "img/green-pot.png",
            "text": "Typescript"
        }, {
            "src": "img/sheild.png",
            "text": "ADA"
        }, {
            "src": "img/blue-pot.png",
            "text": "Unix Shell"
        }, {
            "src": "img/gem.png",
            "text": "Node"
        }]
    }
}];

function isCollide(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

// animates the bottom border or an element
const modalLinks = document.getElementsByClassName('mod-link');

const move = function (elem, bottom) {
    setTimeout(function () {
        if (!elem.parentNode) {
            return null;
        }
        bottom += 10;
        elem.style.bottom = bottom + 'px';
        if (bottom < 500) {
            move(elem, bottom);
        } else {
            elem.parentNode.removeChild(elem);
        }
        [].forEach.call(modalLinks, function (link) {
            if (isCollide(elem, link)) {
                elem.parentNode.removeChild(elem);
                link.style.backgroundColor = 'RED'
                setTimeout(function () {
                    link.style.backgroundColor = ''
                }, 200);
            }
        });
    }, 5);
};
// vanilla append
const insertAfter = function (newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
// turn a string into a DOM node
const domSwap = function (nodeString, referenceNode) {
    const tempNode = document.createElement('span');
    tempNode.innerHTML = nodeString;
    const newNode = tempNode.firstElementChild;
    insertAfter(newNode, referenceNode);
};
// map deataReplace objects to their DOM targets
const injectInDom = function (item) {
    [].forEach.call(document.querySelectorAll('[data-replace="' + item.type + '"]'), (element) => {
        domSwap(item.content, element);
    });
};
// the thing being replaced
const makeTag = function (key) {
    return '{{' + key + '}}';
};
// 
const iterateTemplateContent = function (templateData, templateChunk) {
    const chunkString = templateChunk.outerHTML;
    templateData.forEach(function (content) {
        let stringCopy = chunkString;
        Object.keys(content).forEach(function (contentKey) {
            const targetSubStr = new RegExp(makeTag(contentKey), "g");
            stringCopy = stringCopy.replace(targetSubStr, content[contentKey]);
        });
        stringCopy.replace('data-iterate', '');
        domSwap(stringCopy, templateChunk);
    });
    templateChunk.remove();
};
// create dynamic elements to inject into page
const renderTemplate = function (templateData) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = document.querySelector('[data-template="' + templateData.dataTemplate + '"]').innerHTML;
    Object.keys(templateData.content).forEach(function (contentKey) {
        const templateChunk = wrapper.querySelector('[data-iterate="' + contentKey + '"]');
        iterateTemplateContent(templateData.content[contentKey], templateChunk);
    });
    [].forEach.call(document.querySelectorAll('[data-replace="' + templateData.dataTemplate + '"]'), (element) => {
        insertAfter(wrapper, element);
    });
};
// this is currently just a hacky templater. I want to make it into my own mini templating library, but haven't had time
const processJSONContent = function () {
    dataReplace.forEach((item) => {
        if (item.dataTemplate) {
            renderTemplate(item);
        } else {
            injectInDom(item);
        }
    });
    [].forEach.call(document.querySelectorAll('[data-replace]'), function (node) {
        node.parentNode.removeChild(node);
    });
};
// this sets up listener events for user interaction
const handleInput = function () {
    let shipX = 0;
    let shipM = 0;
    let gameBox = document.getElementsByClassName('game-box')[0];

    // collapse the navbar on scroll
    window.addEventListener('scroll', function () {
        if (document.documentElement.scrollTop > 50) {
            navbar.classList.add('top-nav-collapse');
        } else {
            navbar.classList.remove('top-nav-collapse');
        }
    });
    const portfolioContainer = document.querySelector('#portfolio .container');
    const ship = document.getElementById('ship');
    const shipBound = document.getElementById('ship-bound');

    portfolioContainer.addEventListener('mousemove', function (e) {
        const computedStyle = window.getComputedStyle(portfolioContainer);
        const offsetX = parseInt(computedStyle.getPropertyValue('margin-left'), 10);
        const shipCenter = parseInt(window.getComputedStyle(ship).getPropertyValue('width'), 10) / 2;

        shipM = e.clientX - offsetX - shipCenter;
        console.log(e.clientX, offsetX, shipCenter);
        document.getElementById('ship').style.marginLeft = shipM + 'px';
    });

    function shootBullet() {
        const bullet = document.createElement('div');
        bullet.setAttribute('class', 'bullet');
        bullet.setAttribute('style', 'left:' + (shipM + 52) + 'px;');
        shipBound.appendChild(bullet);
        move(bullet, 0);
    }

    portfolioContainer.addEventListener('click', function () {
        const bullet = document.createElement('div');
        bullet.setAttribute('class', 'bullet');
        bullet.setAttribute('style', 'left:' + (shipM + 52) + 'px;');
        shipBound.appendChild(bullet);
        move(bullet, 0);
    });

    // [].forEach.call(document.getElementsByClassName('mod-link'), function (el) {

    // [].forEach.call(document.getElementsByClassName('mod-link'), function (el) {
    //     el.addEventListener('click', function () {
    //         const ship = document.getElementById('ship-bound');
    //         const bullet = document.createElement('div');
    //         bullet.setAttribute('class', 'bullet');
    //         bullet.setAttribute('style', 'left:' + (shipM + 52) + 'px;');
    //         ship.appendChild(bullet);
    //         move(bullet, 0);
    //     });
    // });
}

document.addEventListener('DOMContentLoaded', handleInput);
processJSONContent();
