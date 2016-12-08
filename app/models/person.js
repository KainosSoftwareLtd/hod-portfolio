'use strict';

module.exports = class Person {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
    }

    static fromJson(data) {
        var p = new Person();
        Object.assign(p, data);

        return p;
    }
}
