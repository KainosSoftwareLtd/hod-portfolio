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
            var searchTerms = filter.split(" ");

            projectList = _.filter(projectList, function (project) {
                var customerMatches = searchTerms.some(term => project.customer.toLowerCase().includes(term.toLowerCase()));
                var nameMatches = searchTerms.some(term => project.name.toLowerCase().includes(term.toLowerCase()));
                var tagMatches = searchTerms.some(term => project.projectMetadata.tags.toLowerCase().includes(term.toLowerCase()));
                var sectorMatches = searchTerms.some(term => project.sector.toLowerCase().includes(term.toLowerCase()));
                var departmentMatches = searchTerms.some(term => project.department.toLowerCase().includes(term.toLowerCase()));
                var agencyMatches = searchTerms.some(term => project.agency.toLowerCase().includes(term.toLowerCase()));
                
                return customerMatches || nameMatches || tagMatches || sectorMatches || departmentMatches || agencyMatches;
            });
        }

        res.render('sales', {
            "data": projectList,
            "filter": filter
        });
    });
};
	
module.exports = SalesController;