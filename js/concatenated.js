'use strict';

var fb = document.querySelector('.feedback');

if (fb) {
  var fbOpen = document.querySelector('.contacts__btn');
  var fbClose = fb.querySelector('.feedback__close');
  var fbForm = fb.querySelector('.feedback__form');
  var fbName = fb.querySelector('[name=name]');
  var fbEmail = fb.querySelector('[name=email]');
  var fbMessage = fb.querySelector('[name=message]');
  var overlay = document.querySelector('.modal__overlay');

  fbOpen.addEventListener('click', function (event) {
    event.preventDefault();
    fb.classList.add('feedback--show');
    overlay.classList.add('modal__overlay--show');
    fbName.focus();
  });

  fbClose.addEventListener('click', function (event) {
    event.preventDefault();
    fb.classList.remove('feedback--show');
    fb.classList.remove('feedback--error');
    overlay.classList.remove('modal__overlay--show');
  });

  fbForm.addEventListener('submit', function (event) {
    if (!fbName.value || !fbEmail.value || !fbMessage.value) {
      event.preventDefault();
      fb.classList.remove('feedback--error');
      void (fb.offsetWidth); // Обновление анимации
      fb.classList.add('feedback--error');
    } else {
      overlay.classList.remove('modal__overlay--show');
    }
  });

  window.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) {
      event.preventDefault();
      if (fb.classList.contains('feedback--show')) {
        fb.classList.remove('feedback--show');
        fb.classList.remove('feedback--error');
        overlay.classList.remove('modal__overlay--show');
      }
    }
  });
}

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  svg4everybody();
});

'use strict';

var slider = document.querySelector('.slider');

if (slider) {
  var sliderControls = slider.querySelectorAll('.slider__control-item');
  var sliderSlides = slider.querySelectorAll('.slider__slide');
  var body = document.querySelector('.index');

  for (var i = 0; i < sliderControls.length; i++) {
    sliderControls[i].addEventListener('click', function (event) {

      for (var j = 0; j < sliderControls.length; j++) {
        sliderControls[j].removeAttribute('disabled');
        sliderSlides[j].classList.remove('slide--active');
      }

      event.currentTarget.setAttribute('disabled', 'disabled');

      sliderSlides[Array.prototype.indexOf.call(
          event.currentTarget.parentElement.children, event.currentTarget
      )].classList.add('slide--active');

      body.className = 'index index--' + (Array.prototype.indexOf.call(
          event.currentTarget.parentElement.children, event.currentTarget) + 1);
    });
  }

}

!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)),
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});
