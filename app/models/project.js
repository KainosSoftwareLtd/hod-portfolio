'use strict';
var _ = require('underscore');
var Person = require('./person');

module.exports = class Project {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ourTeam = [];
        this.clientTeam = [];
    }

    set setId(int) { this.id = int; }
    set setName(str) { this.name = str; }
    set setDescription(str) { this.description = str; }
    set setLocation(str) { this.location = str; }
    set setDepartment(str) { this.department = str; }
    set setAgency(str) { this.agency = str; }
    set setHealth(str) { this.health = str; }
    set setPriority(str) { this.priority = str; }
    set setOurTeam(ourTeam){ this.ourTeam = ourTeam; }
    set setClientTeam(clientTeam){ this.clientTeam = clientTeam; }

    get getId() { return this.id; }
    get getName() { return this.name; }
    get getDescription() { return this.description; }
    get getLocation() { return this.location; }
    get getDepartment() { return this.department; }
    get getAgency() { return this.agency; }
    get getHealth() { return this.health; }
    get getPriority() { return this.priority; }
    get getOurTeam() { return this.ourTeam; }
    get getClientTeam() { return this.clientTeam; }

    addToOurTeam(Person) {
        this.ourTeam.push(Person);
    }

    addToClientTeam(Person) {
        this.clientTeam.push(Person);
    }

    removeFromOurTeam(id) {
        this.ourTeam = _.reject(this.ourTeam, function(person) {
            return person.id === id;
        });
    }

    removeFromClientTeam(id) {
        this.clientTeam = _.reject(this.clientTeam, function(person) {
            return person.id === id;
        });
    }
}
