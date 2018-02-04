'use strict';
var utils = require('../utils/utils');

module.exports = class Person {
    constructor(name, role) {
        this.name = name;
        this.role = role;

        this.id = utils.generateGUID();
    }

    setId(str) { this.id = str; }
    setName(str) { this.name = str; }
    setRole(str) { this.role = str; }
    setEmail(str) { this.email = str; }
    setMobile(str) { this.mobile = str; }
    setSkype(str) { this.skype = str; }
    setSlack(str) { this.slack = str; }

    static fromJson(data) {
        var p = new Person();
        Object.assign(p, data);

        if (!p.id) { // if Object.assign removed the id
            p.id = utils.generateGUID();
        }

        return p;
    }
}
