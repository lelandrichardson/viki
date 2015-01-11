// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

function componentToHex ( c ) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex ( r, g, b ) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//function hexToRgb(hex) {
//    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//    return result ? {
//        r: parseInt(result[1], 16),
//        g: parseInt(result[2], 16),
//        b: parseInt(result[3], 16)
//    } : null;
//}

function hexToRgb ( hex ) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function ( m, r, g, b ) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbaToHexAndAlpha ( rgba ) {
    var result = /^rgba\((\d+),(\d+),(\d+),([.\d]+)\)$/i.exec(rgba);
    return {
        hex: rgbToHex(parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)),
        alpha: parseFloat(result[4])
    };
}

module.exports = {
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    rgbaToHexAndAlpha: rgbaToHexAndAlpha
};