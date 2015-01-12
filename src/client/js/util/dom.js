/**
 * Returns the effective viewport size of the browser, in pixels
 * @returns {{screenWidth: Number, screenHeight: Number}}
 */
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

/**
 * Utility for binding to browser events in a browser compatible way. Used like el.addEventListener.
 * @param el
 * @param event
 * @param handler
 */
function listenToEvent ( el, event, handler ) {
    if (el.addEventListener) {
        el.addEventListener(event, handler, false);
    } else if (el.attachEvent) {
        el.attachEvent("on" + event, handler);
    }
}

/**
 * a browser compatible wrapper around el.removeEventListener
 * @param el
 * @param event
 * @param handler
 */
function ignoreEvent ( el, event, handler ) {
    if (el.removeEventListener) {
        el.removeEventListener(event, handler, false);
    } else if (el.detachEvent) {
        el.detachEvent("on" + event, handler);
    }
}

/**
 * A shortcut method for binding to a browser event only once
 * @param el
 * @param event
 * @param handler
 */
function listenOnce ( el, event, handler ) {
    var wrapper = function () {
        handler.apply(this, arguments);
        ignoreEvent(el, event, wrapper);
    };
    listenToEvent(wrapper);
}

/**
 * Gets the offset of an element. based off of jQuery.fn.offset
 * @param el
 * @returns {{top: number, left: number}}
 */
function offset ( el ) {
    var win = window,
        doc = win.document.documentElement,
        box = el.getBoundingClientRect();

    return {
        top: box.top + win.pageYOffset - doc.clientTop,
        left: box.left + win.pageXOffset - doc.clientLeft
    };
}

/**
 * Returns the current width of an element, optionally including the margin
 * @param el
 * @param includeMargin
 * @returns {number}
 */
function outerWidth ( el, includeMargin ) {
    var width = el.offsetWidth;

    if (!includeMargin) {
        return width;
    }

    var style = getComputedStyle(el);

    width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
    return width;
}

/**
 * Returns the current height of an element, optionally including the margin
 * @param el
 * @param includeMargin
 * @returns {number}
 */
function outerHeight ( el, includeMargin ) {
    var height = el.offsetHeight;

    if (!includeMargin) {
        return height;
    }

    var style = getComputedStyle(el);

    height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
    return height;
}

/**
 * Returns an array of all of a given element's parents, ending at the <html> element
 * @param el
 * @returns {Array}
 */
function parents ( el ) {
    var result = [];
    while (el && el.tagName !== "HTML") {
        el = el.parentNode;
        result.push(el);
    }
    return result;
}

function isFunction ( func ) {
    return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]'
}

// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
function findInArray ( array, callback ) {
    for (var i = 0, length = array.length, element = null; i < length, element = array[i]; i++) {
        if (callback.apply(callback, [element, i, array])) {
            return element;
        }
    }
}

/**
 * Tests whether a given element satisfies a CSS selector
 * @param el
 * @param selector
 * @returns {*}
 */
function matchesSelector ( el, selector ) {
    var method = findInArray([
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector'
    ], function ( method ) {
        return isFunction(el[method]);
    });

    return el[method].call(el, selector);
}

/**
 * Tests whether a given element, or any if it's parents, satisfy a given CSS selector
 * @param el
 * @param selector
 * @param includeParents
 * @returns {*}
 */
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

/**
 * Returns the nearest parent which satisfies a given CSS selector.
 * @param el
 * @param selector
 * @returns {*}
 */
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