'use strict';

var ApiUtils= function () {
};

ApiUtils.ApiResponse = class {
    constructor(result, messages) {
        this.result = result;
        this.messages = messages;
    }

    /**
     * @param {any} obj Result returned by API
     * @memberOf ApiResponse
     */
    setResult(obj) { this.result = obj; }

    /**
     * @param {any} obj Messages returned by API
     * @memberOf ApiResponse
     */
    setMessages(obj) { this.messages = obj; }
};

/**
 * Standard approach to returning results
 * @param res The response object used by express framework
 * @param {Number} status HTTP status code
 * @param {ApiResponse} response data returned from our API
 */
ApiUtils.handleResultSet = function(res, status, apiResponse) {
    res.status(status || 500).json(apiResponse);
};

module.exports = ApiUtils;
