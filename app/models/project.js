'use strict';
var _ = require('underscore');
var Person = require('./person');
var ResourceLink = require('./resourceLink');
var HealthRecord = require('./healthRecord');

module.exports = class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.ourTeam = [];
        this.clientTeam = [];
        this.healthStatusHistory = {};
        this.health = {};
        this.resources = [];
        this["phaseHistory"] = {};

        // setting defaults - this project was designed not to work without them...
        this.facing = "user";
        this.priority = "Low";
        this.location = "Unknown";
        this.health.overall = new HealthRecord(
            "overall",
            "unknown",
            {name: "Added Automatically", email: ""},
            "Overall project health has not yet been set.");
    }

    setId(str) { this.id = str; }
    setName(str) { this.name = str; }
    setDescription(str) { this.description = str; }
    setLocation(str) { this.location = str; }
    setDepartment(str) { this.department = str; }
    setAgency(str) { this.agency = str; }
    setIsFinished(bool) { this.isFinished = bool; }
    setCustomer(str) { this.customer = str; }
    setHealth(type, status, user, comment, linkTitle, link) {
        var resource = null;
        if(linkTitle && link) {
            resource = new ResourceLink(linkTitle, link);
        }

        var h = new HealthRecord(type, status, user, comment, resource);

        if(status && !this.health[type] || status && status !== this.health[type].status) {
            this.addHealthHistory(h);
        }

        if(status && type) {
            this.health[type] = h;
        }
    }

    setPriority(str) { this.priority = str; }
    setOurTeam(ourTeam) { this.ourTeam = ourTeam; }
    setClientTeam(clientTeam) { this.clientTeam = clientTeam; }
    setPhase(phase) {
        var now = new Date(); // current date
        // set project phase history completed record
        if(this.phase !== phase) {
            if(!this["phaseHistory"][this.phase] && this.phase) {
                this["phaseHistory"][this.phase] = [];
            }

            if(this.phase) {
                this["phaseHistory"][this.phase].push({
                    label: "Completed", 
                    year: now.getFullYear(), 
                    month: now.toLocaleString('en-GB', { month: "long" })
                });
            }
        }

        // set project phase history started record
        if(!this["phaseHistory"][phase]) {
            this["phaseHistory"][phase] = [];

            this["phaseHistory"][phase].push({
                label: "Started", 
                year: now.getFullYear(), 
                month: now.toLocaleString('en-GB', { month: "long" })
            });
        }

        this.phase = phase;

    }
    setResources(resources) { this.resources = resources; }
    setHealthStatusHistory(array) { this.healthStatusHistory = array; }
    setPhaseHistory(phaseHistory) { this.phaseHistory = phaseHistory; }

    addToOurTeam(Person) {
        this.ourTeam.push(Person);
    }

    addToClientTeam(Person) {
        this.clientTeam.push(Person);
    }

    addResource(ResourceLink) {
        this.resources.push(ResourceLink);
    }

    addHealthHistory(healthHistory) {
        if(!this.healthStatusHistory[healthHistory.type]) {
            this.healthStatusHistory[healthHistory.type] = [];
        }

        this.healthStatusHistory[healthHistory.type].push(healthHistory);
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

        if (data && data.health) {
            p.health = _.mapObject(data.health, function(val, key) {
                return HealthRecord.fromJson(val);
            });
        }

        if (data && data.healthStatusHistory) {
            p.healthStatusHistory = _.mapObject(data.healthStatusHistory, function(values, key) {
                return values.map(function(value) {
                    return HealthRecord.fromJson(value);
                });
            });
        }

        return p;
    }
}
