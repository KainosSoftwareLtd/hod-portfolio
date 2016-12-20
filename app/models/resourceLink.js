'use strict';
var utils = require('../utils');

module.exports = class ResourceLink {
    constructor(name, url) {
        this.name = name;
        this.url = url;

        this.id = utils.generateGUID();
    }
    
    setId(str) { this.id = str; }
    setName(str) { this.name = str; }
    setUrl(str) { this.url= str; }

    static fromJson(data) {
        var r = new ResourceLink();
        Object.assign(r, data);
        
        if (!r.id) { // if Object.assign removed the id
            r.id = utils.generateGUID();
        }

        return r;
    }
}
