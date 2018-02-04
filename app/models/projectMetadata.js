'use strict';
var utils = require('../utils/utils');

module.exports = class ProjectMetadata {
    constructor(tags) {
        this.tags = tags;

        this.id = utils.generateGUID();
    }

    setId(str) { this.id = str; }
	
    setTags(str) { 
		this.tags = str;
	}
 
	getTagArray()
	{
		return utils.split(this.tags, ',');
	}
 
    static fromJson(data) {
        var p = new ProjectMetadata();
        Object.assign(p, data);

        if (!p.id) { // if Object.assign removed the id
            p.id = utils.generateGUID();
        }
		
        return p;
    }
}
