'use strict';
var _ = require('underscore');
var connect = require('connect-ensure-login');
var projectCache = require('../dao/projectCache');
var log = require('../logger');
var utils = require('../utils/utils');

function InfoController(router) {
    if (!(this instanceof InfoController)) {
        return new InfoController(router);
    }
    this.router = router;
}

// A way to force the ordering of the phases.
var phase_order = ['pipeline', 'discovery', 'alpha', 'beta', 'live'];

var healthCheckTypes =  {
    "overall": {label: "Overall"},
    "commercial": {label: "Commercial"},
    "engineering": {label: "Engineering"},
    "ops": {label: "Operations"},
    "userResearch": {label: "User Research"},
    "security": {label: "Security"},
    "delivery": {label: "Delivery"},
    "data": {label: "Data"}
}

var sectorTypes =  {
    "public": {label: "Public"},
    "private": {label: "Private"}
}

/**
 * Render Projects Overview page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleProjectIdSlug = function(req, res) {
    projectCache.getById(req.params.id, function(error, data) {
        res.render('project', {
            "data": data,
            "phase_order": phase_order,
            "sectorTypes": sectorTypes
        });
    });
};

/**
 * Render Add Project page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleAddProject = function(req, res) {
    res.render('add-project');
};

/**
 * Render Edit resources page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditResources = function (req, res) {
    var id = req.params.id;

    projectCache.getById(id, function(error, project) {
        res.render('edit-resources', {
            projectName: project.name,
            projectId: id,
            resources: project.resources
        });
    });
};

/**
 * Render Edit resource form
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditResource = function (req, res) {
    var projectId = req.params.projectId;
    var resourceId = req.params.resourceId;

    projectCache.getById(projectId, function(error, project) {
        var resource = _.find(project.resources, {id: resourceId});

        res.render('edit-resource', {
            projectName: project.name,
            projectId: projectId,
            resource: resource
        });
    });
};

/**
 * Render Edit phase history form
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditPhaseHistory = function (req, res) {
    var projectId = req.params.projectId;

    projectCache.getById(projectId, function(error, project) {
        res.render('edit-phase-history', {
            project: project,
            phase_order: phase_order
        });
    });
};

/**
 * Render Edit team members page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditOurTeam = function (req, res) {
    var id = req.params.id;

    var project = projectCache.getById(id, function(error, project) {
        res.render('edit-our-team', {
            projectName: project.name,
            projectId: id,
            teamMembers: project.ourTeam
        });
    });
};

/**
 * Render Edit team member page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditTeamMember = function (req, res) {
    var projectId = req.params.projectId;
    var personId = req.params.personId;

    projectCache.getById(projectId, function(error, project) {
        var person = _.find(project.ourTeam, {id: personId});

        res.render('edit-person', {
            projectName: project.name,
            projectId: projectId,
            person: person
        });
    });
};

/**
 * Render Edit client team members page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditClientTeam = function (req, res) {
    var id = req.params.id;

    projectCache.getById(id, function(error, project) {
        res.render('edit-client-team', {
            projectName: project.name,
            projectId: id,
            teamMembers: project.clientTeam
        });
    });
};

/**
 * Render Edit client team member page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditClientTeamMember = function (req, res) {
    var projectId = req.params.projectId;
    var personId = req.params.personId;

    projectCache.getById(projectId, function(error, project) {
        var person = _.find(project.clientTeam, {id: personId});

        res.render('edit-client', {
            projectName: project.name,
            projectId: projectId,
            person: person
        });
    });
};

/**
 * Render Edit project health status
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditHealthStatus = function (req, res) {
    var id = req.params.id;

    projectCache.getById(id, function(error, project) {
        res.render('edit-health', {
            project: project,
            convertDate: utils.convertDate,
            healthCheckTypes: healthCheckTypes
        });
    });
};

/**
 * Render Edit project health status
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleDisplayHealthStatus = function (req, res) {
    var id = req.params.id;

    projectCache.getById(id, function(error, project) {
        var healthHistory = _.chain(project.healthStatusHistory).map(_.values).flatten().sortBy("date").reverse().value();

        res.render('display-health', {
            project: project,
            history: healthHistory,
            convertDate: utils.convertDate,
            healthCheckTypes: healthCheckTypes
        });
    });
};

/**
 * Render Edit project health status
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleDisplayHealthHistory = function (req, res) {
    var id = req.params.id;

    projectCache.getById(id, function(error, project) {
        var healthHistory = _.chain(project.healthStatusHistory).map(_.values).flatten().sortBy("date").reverse().value();

        res.render('display-health-history', {
            project: project,
            history: healthHistory,
            convertDate: utils.convertDate,
            healthCheckTypes: healthCheckTypes
        });
    });
};

// Edit project form
InfoController.prototype.handleEditProject = function(req, res) {
    var id = req.params.id;
    projectCache.getById(id, function(error, project) {
        res.render('edit-project', {
            project: project,
            sectorTypes: sectorTypes
        });
    });
};

/**
 * @param  {String|function} groupBy Name of the field by which the projects will be grouped
 * @param  {String} path Router path, ex: '/location'
 * @param  {String[]} [rowOrder] Order of values by which to group the projects, default: alphabetical
 * @param  {String=} [viewType] Optional view name if groupBy is not a string
 */
InfoController.prototype.setupIndexPageRoute = function(groupBy, path, rowOrder, viewType) {
    this.router.get(path, connect.ensureLoggedIn(), function(req, res) {
        var view = viewType ? viewType : groupBy;
		
        projectCache.getAll(function(err, projectMap) {
            var projectList = [];

            _.each(projectMap, function (proj) {
                projectList.push(proj)
            });

            projectList = showFinishedProjectsIfRequested(projectList, req.cookies.showFinished);
            var data = filterPhaseIfPresent(projectList, req.query.phase);
            data = _.groupBy(data, groupBy);
            var new_data = indexify(data);
            var phases = _.countBy(projectList, 'phase');
            rowOrder = prepareRowOrder(rowOrder, data);

            res.render('index', {
                "data": new_data,
                "phase": req.query.phase,
                "showFinished": req.cookies.showFinished,
                "counts": phases,
                "view": view,
                "row_order": rowOrder,
                "phase_order": phase_order
            });
        });
    });
};

/**
 * Prepare row order
 *
 * @param  {String[]} [rowOrder] list that forces the order of values by which the projects are grouped
 * @param  {Object[]} data projects
 * @return {String[]} list showing the order of values by which the projects are grouped
 */
function prepareRowOrder(rowOrder, data) {
    if (!rowOrder || rowOrder.length === 0) {
        rowOrder = [];
        _.each(data, function(value, key, list) {
            rowOrder.push(key);
        });
        rowOrder.sort();
    }

    return rowOrder;
}

/*
A function to gather the data by
'phase' and then 'facing' so the
index.html can spit them out.
*/
function indexify(data) {
    var new_data = {};
    _.each(data, function(value, key, list) {
        var item = _.groupBy(value, 'phase');
        new_data[key] = {};
        _.each(item, function(v, k, l) {
            var piece = _.groupBy(v, 'facing');
            new_data[key][k] = piece;
        });
    });
    return new_data;
}

// If phaseName was provided, trim projects that don't belong to that phase
// Otherwise return unmodified data
function filterPhaseIfPresent(data, phaseName) {
    if (typeof phaseName !== "undefined" && phaseName !== "all") {
        data = _.where(data, { "phase": phaseName });
    }
    return data;
}

// If showFinished is falsy, trim unfinished projects
// Otherwise return unmodified data
function showFinishedProjectsIfRequested(data, showFinished) {
    if (!showFinished) {
        data = _.where(data, { "isFinished": false });
    }
    return data;
}

/**
 * Render Edit project metadata page
 *
 * @param req
 * @param res
 */
InfoController.prototype.handleEditProjectMetadata = function (req, res) {
    var id = req.params.id;
    projectCache.getById(id, function(error, project) {
        res.render('edit-project-metadata', {
            project: project
        });
    });
};
	
module.exports = InfoController;