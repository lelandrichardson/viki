function windowSize () {
    var w = window,
        d = document,
        e = d.documentElement,
        g = document.body || d.getElementsByTagName('body')[0];

    return {
        screenWidth: w.innerWidth || e.clientWidth || g.clientWidth,
        screenHeight: w.innerHeight || e.clientHeight || g.clientHeight
    };
}

function listenToEvent ( el, event, handler ) {
    if (el.addEventListener) {
        el.addEventListener(event, handler, false);
    } else if (el.attachEvent) {
        el.attachEvent("on" + event, handler);
    }
}

function ignoreEvent ( el, event, handler ) {
    if (el.removeEventListener) {
        el.removeEventListener(event, handler, false);
    } else if (el.detachEvent) {
        el.detachEvent("on" + event, handler);
    }
}

function listenOnce ( el, event, handler ) {
    var wrapper = function () {
        handler.apply(this, arguments);
        ignoreEvent(el, event, wrapper);
    };
    listenToEvent(wrapper);
}

// get the offset of an element. based off of jQuery.fn.offset
function offset ( el ) {
    var win = window,
        doc = win.document.documentElement,
        box = el.getBoundingClientRect();

    return {
        top: box.top + win.pageYOffset - doc.clientTop,
        left: box.left + win.pageXOffset - doc.clientLeft
    };
}

function outerWidth ( el, includeMargin ) {
    var width = el.offsetWidth;

    if (!includeMargin) {
        return width;
    }

    var style = getComputedStyle(el);

    width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
    return width;
}

function outerHeight ( el, includeMargin ) {
    var height = el.offsetHeight;

    if (!includeMargin) {
        return height;
    }

    var style = getComputedStyle(el);

    height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
    return height;
}

function parents ( el ) {
    var result = [];
    while (el && el.tagName !== "BODY") {
        el = el.parentNode;
        result.push(el);
    }
    return result;
}

function isFunction(func) {
    return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]'
}

// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
function findInArray(array, callback) {
    for (var i = 0, length = array.length, element = null; i < length, element = array[i]; i++) {
        if (callback.apply(callback, [element, i, array])) return element;
    }
}

function matchesSelector( el, selector ) {
    var method = findInArray([
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector'
    ], function(method){
        return isFunction(el[method]);
    });

    return el[method].call(el, selector);
}

function matches ( el, selector, includeParents ) {
    var matches = matchesSelector(el, selector);

    if (matches || !includeParents) {
        return matches;
    }

    var ancestors = parents(el), i;

    for (i = 0; i < ancestors.length; i++) {
        el = ancestors[i];
        if (matchesSelector(el, selector)) {
            return true;
        }
    }

    return false;
}

function closest ( el, selector ) {
    var ancestors = parents(el), i;

    for (i = 0; i < ancestors.length; i++) {
        el = ancestors[i];
        if (matchesSelector(el, selector)) {
            return el;
        }
    }
    return null;
}

module.exports = {
    matches: matches,
    parents: parents,
    outerHeight: outerHeight,
    outerWidth: outerWidth,
    offset: offset,
    ignoreEvent: ignoreEvent,
    listenToEvent: listenToEvent,
    listenOnce: listenOnce,
    windowSize: windowSize,
    closest: closest
};