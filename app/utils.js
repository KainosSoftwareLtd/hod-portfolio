'use strict';

var Utils = function () {
};

/**
 * Generates a GUID
 */
Utils.generateGUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

Utils.convertDate = function(timestamp) {
    return new Date(timestamp).toLocaleDateString("en-GB",
        { year: 'numeric', month: 'long', day: 'numeric' }
    );
};

Utils.split = function(str, delimiter) {

    return String(str).split(delimiter);
};


module.exports = Utils;
