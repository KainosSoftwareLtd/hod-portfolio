'use strict';
var utils = require('../utils');

module.exports = class HealthHistory {
    constructor(status, user, comment) {
        this.status = status;
        this.comment = comment;
        this.date = Date.now();
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

    static fromJson(data) {
        var hh = new HealthHistory();
        Object.assign(hh, data);

        if (!hh.id) { // if Object.assign removed the id
            hh.id = utils.generateGUID();
        }

        return hh;
    }
}
