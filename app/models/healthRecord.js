'use strict';
var utils = require('../utils/utils');
var ResourceLink = require('./resourceLink');

module.exports = class HealthRecord {
    constructor(type, status, user, comment, resourceLink) {
        this.type = type;
        this.status = status ? status.toLowerCase(): 'unknown';
        this.comment = comment;
        this.date = Date.now();
        this.link = resourceLink;
        this.user = user;

        this.id = utils.generateGUID();
    }

    setId(str) { this.id = str; }
    setStatus(str) { this.status = str ? str.toLowerCase(): 'unknown'; }
    setComment(str) { this.comment = str; }
    setDate(timestamp) { this.date = timestamp; }
    setUser(user) { this.user = {name: user.displayName, email: user.email}; }
    setType(str) { this.type = str }
    setLink(resourceLink) { this.link = resourceLink; }

    static fromJson(data) {
        var hr = new HealthRecord();
        data.status = data.status ? data.status.toLowerCase(): 'unknown';
        Object.assign(hr, data);

        if (data.link) {
            hr.link = ResourceLink.fromJson(data.link);
        }

        if (!hr.id) { // if Object.assign removed the id
            hr.id = utils.generateGUID();
        }

        return hr;
    }
}
