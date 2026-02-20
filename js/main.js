// TODO: move all of this into seperate JSON content files
const dataReplace = [{
    "type": "contact-link",
    "content": "<li><a href=\"mailto:jocelynsmith.dev+portfolio@gmail.com\" class=\"btn btn-default btn-lg\"><i class=\"fa fa-envelope fa-fw\"></i><span class=\"network-name\">Contact Jocelyn</span></a></li>"
}, {
    "type": "close-button",
    "content": "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"
}, {
    "dataTemplate": "navbar-main-collapse",
    "content": {
        "listItem": [{
            "href": "contact",
            "text": "Contact"
        }, {
            "href": "work-history",
            "text": "Work History"
        }, {
            "href": "portfolio",
            "text": "Portfolio"
        }, {
            "href": "about",
            "text": "About"
        }]
    }
}, {
    "dataTemplate": "contact-section",
    "content": {
        "listItem": [{
            "href": "mailto:jocelynsmith.dev+portfolio@gmail.com",
            "icon": "envelope",
            "text": "Email"
        }, {
            "href": "https://github.com/JocelynWordSmith",
            "icon": "github",
            "text": "Github"
        }, {
            "href": "https://www.linkedin.com/in/hire-jocelyn/",
            "icon": "linkedin",
            "text": "LinkedIn"
        }],
        "signoff": [{
            "header": "Contact Jocelyn Smith",
            "copy1": "Whether you want to build something together, have questions about my work, or just want to connect — I'd love to hear from you.",
            "copy2": "References (and sweet drum solos) available upon request."
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
    let shipM = 0;

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
        const containerRect = portfolioContainer.getBoundingClientRect();
        const shipWidth = ship.offsetWidth;

        shipM = e.clientX - containerRect.left - shipWidth / 2;
        shipM = Math.max(0, Math.min(shipM, containerRect.width - shipWidth));
        ship.style.marginLeft = shipM + 'px';
    });

    portfolioContainer.addEventListener('click', function () {
        const bullet = document.createElement('div');
        bullet.setAttribute('class', 'bullet');
        bullet.setAttribute('style', 'left:' + (shipM + 52) + 'px;');
        shipBound.appendChild(bullet);
        move(bullet, 0);
    });

}

document.addEventListener('DOMContentLoaded', handleInput);

// ── Modal ──────────────────────────────────────────────────────────────────
function openModal(modal) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
    modal.removeAttribute('aria-hidden');
    modal.classList.add('in');
}
function closeModal(modal) {
    modal.classList.remove('in');
    modal.setAttribute('aria-hidden', 'true');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
}

document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-toggle="modal"]');
    if (trigger) {
        const target = document.querySelector(trigger.dataset.target);
        if (target) {
            // Delay portfolio modals on desktop so the bullet animation plays out first
            const delay = trigger.closest('.download-section') && window.innerWidth >= 767 ? 300 : 0;
            setTimeout(() => openModal(target), delay);
        }
        return;
    }
    const dismiss = e.target.closest('[data-dismiss="modal"]');
    if (dismiss) { const m = dismiss.closest('.modal'); if (m) closeModal(m); return; }
    if (e.target.classList.contains('modal') && e.target.classList.contains('in')) closeModal(e.target);
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { const m = document.querySelector('.modal.in'); if (m) closeModal(m); }
});

// ── Navbar collapse ────────────────────────────────────────────────────────
document.addEventListener('click', function (e) {
    const toggle = e.target.closest('[data-toggle="collapse"]');
    if (toggle) { const t = document.querySelector(toggle.dataset.target); if (t) t.classList.toggle('in'); }
});

// ── Scrollspy ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
    const sections = Array.from(navLinks)
        .map(a => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let current = '';
        sections.forEach(s => { if (scrollTop >= s.offsetTop - 80) current = s.id; });
        navLinks.forEach(a => {
            a.parentElement.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }, { passive: true });
});

processJSONContent();
// Swap data-src → src so template imgs don't fire a request for the literal "{{src}}" string
document.querySelectorAll('img[data-src]').forEach(function (img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
});
