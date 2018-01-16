'use strict';
var utils = require('../utils');

module.exports = class Person {
    constructor(name, role) {
        this.name = name;
        this.role = role;

        this.id = utils.generateGUID();
		
		this.isSalesOwner = false;
		this.isTechDelOwner = false;
    }

    setId(str) { this.id = str; }
    setName(str) { this.name = str; }
    setRole(str) { this.role = str; }
    setEmail(str) { this.email = str; }
    setMobile(str) { this.mobile = str; }
    setSkype(str) { this.skype = str; }
    setSlack(str) { this.slack = str; }
	setIsSalesOwner(bool) { this.isSalesOwner = bool; }
	setIsTechDelOwner(bool) { this.isTechDelOwner = bool; }

    static fromJson(data) {
        var p = new Person();
        Object.assign(p, data);

        if (!p.id) { // if Object.assign removed the id
            p.id = utils.generateGUID();
        }
		p.setIsSalesOwner(p.isSalesOwner == true);
		p.setIsTechDelOwner(p.isTechDelOwner == true);
		
        return p;
    }
}
