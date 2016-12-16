'use strict';
var _ = require('underscore');
var Person = require('./person');
var ResourceLink = require('./resourceLink');

module.exports = class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.ourTeam = [];
        this.clientTeam = [];
        this.resources = [];

        // setting defaults - this project was designed not to work without them...
        this.facing = "user";
        this.priority = "Low";
        this.location = "Unknown";
    }

    setId(str) { this.id = str; }
    setName(str) { this.name = str; }
    setDescription(str) { this.description = str; }
    setLocation(str) { this.location = str; }
    setDepartment(str) { this.department = str; }
    setAgency(str) { this.agency = str; }
    setHealth(str) { this.health = str; }
    setPriority(str) { this.priority = str; }
    setOurTeam(ourTeam) { this.ourTeam = ourTeam; }
    setClientTeam(clientTeam) { this.clientTeam = clientTeam; }
    setPhase(phase) { this.phase = phase; }
    setResources(resources) { this.resources = resources; }

    addToOurTeam(Person) {
        this.ourTeam.push(Person);
    }

    addToClientTeam(Person) {
        this.clientTeam.push(Person);
    }

    addResource(ResourceLink) {
        this.resources.push(ResourceLink);
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

    removeFromResources(id) {
        this.resources = _.reject(this.resources, function(resource) {
            return resource.id === id;
        });
    }

    static fromJson(data) {
        var p = new Project();
        Object.assign(p, data);

        if (data && data.ourTeam) {
            p.setOurTeam([]);
            data.ourTeam.forEach(function(item) {
                p.addToOurTeam(Person.fromJson(item));
            });
        }

        if (data && data.clientTeam) {
            p.setClientTeam([]);
            data.clientTeam.forEach(function(item) {
                p.addToClientTeam(Person.fromJson(item));
            });
        }

        if (data && data.resources) {
            p.setResources([]);
            data.resources.forEach(function(item) {
                p.addResource(ResourceLink.fromJson(item));
            });
        }


        return p;
    }
}
