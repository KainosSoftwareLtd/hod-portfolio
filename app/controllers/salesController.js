'use strict';
var _ = require('underscore');
var connect = require('connect-ensure-login');
var projectCache = require('../dao/projectCache');
var log = require('../logger');
var utils = require('../utils/utils');

function SalesController(router) {
    if (!(this instanceof SalesController)) {
        return new SalesController(router);
    }
    this.router = router;
}

// Edit project form
SalesController.prototype.handleSalesView = function(req, res) {
    var filter = req.query.q;

    projectCache.getAll(function (err, projectMap) {
        var projectList = [];

        _.each(projectMap, function (proj) {
            projectList.push(proj)
        });

        if(filter){
            projectList = _.filter(projectList, function (project) {
                return project.customer.toLowerCase().includes(filter.toLowerCase()) || 
                project.name.toLowerCase().includes(filter.toLowerCase()) || 
                project.projectMetadata.tags.toLowerCase().includes(filter.toLowerCase()) ||
                project.sector.toLowerCase().includes(filter.toLowerCase()) ||
                project.department.toLowerCase().includes(filter.toLowerCase()) ||
                project.agency.toLowerCase().includes(filter.toLowerCase());
            });
        }

        res.render('sales', {
            "data": projectList,
            "filter": filter
        });
    });
};
	
module.exports = SalesController;