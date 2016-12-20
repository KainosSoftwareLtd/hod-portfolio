'use strict';
var utils = require('../utils');
var ResourceLink = require('./resourceLink');

module.exports = class HealthRecord {
    constructor(type, status, user, comment, resourceLink) {
        this.type = type;
        this.status = status;
        this.comment = comment;
        this.date = Date.now();
        this.link = resourceLink;
        if(user) {
            this.user = {name: user.displayName, email: user.email};
        }

        this.id = utils.generateGUID();
    }

    setId(str) { this.id = str; }
    setStatus(str) { this.status = str; }
    setComment(str) { this.comment = str; }
    setDate(timestamp) { this.date = timestamp; }
    setUser(user) { this.user = {name: user.displayName, email: user.email}; }
    setType(str) { this.type = str }
    setLink(resourceLink) { this.link = resourceLink; }

    static fromJson(data) {
        var hr = new HealthRecord();
        Object.assign(hh, data);

        if (data.link) {
            hr.link = ResourceLink.fromJson(data.link);
        }

        if (!hr.id) { // if Object.assign removed the id
            hr.id = utils.generateGUID();
        }

        return hr;
    }
}
