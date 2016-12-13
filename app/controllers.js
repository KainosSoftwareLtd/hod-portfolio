'use strict';
var _ = require('underscore');
var connect = require('connect-ensure-login');
var projectCache = require('./projectCache');
var log = require('./logger');
var apiUtils = require('./apiUtils');
var projectDao = require('./dao/project');
var Project = require('./models/project');
var Person = require('./models/person');
var ApiResponse = apiUtils.ApiResponse;

function Controller(router) {
    if (!(this instanceof Controller)) {
        return new Controller(router);
    }
    this.router = router;
}

// A way to force the ordering of the phases.
var phase_order = ['pipeline', 'discovery', 'alpha', 'beta', 'live'];


// JSON data of a project
Controller.prototype.handleApiProjectId = function(req, res) {
    var data = projectCache.getById(req.params.id);
    if (data) {
        res.json(data);
    } else {
        res.json({ error: 'ID not found' });
    }
};

// JSON data of a project
Controller.prototype.handleApiAddProject = function(req, res) {
    let newProject = new Project(req.body.name, req.body.description);
    newProject.setLocation(req.body.location);
    newProject.setPhase(req.body.phase);
    
    projectDao.addProject(newProject, function(err, project) {
        log.trace('Adding project: ' + JSON.stringify(project));
        if(err) {
            log.debug('Error adding project with id = ' + project.id);

            apiUtils.handleResultSet(res, 500, 
                new ApiResponse(null, ['Error adding project'])
            );
        } else {
            log.debug('Project with id = ' + project.id + ' has been added');

            projectCache.refreshProjectCache();
            apiUtils.handleResultSet(res, 200, 
                new ApiResponse({projectId: project.id}, ['The project has been added'])
            );
        }
    });
};

/**
 * Add team member
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiAddTeamMember = function(req, res) {
    let newPerson = new Person(req.body.name, req.body.role);
    newPerson.setEmail(req.body.email);
    newPerson.setMobile(req.body.mobile);
    newPerson.setSkype(req.body.skype);
    newPerson.setSlack(req.body.slack);

    log.info('Adding a new team member to project ID: ' + req.params.projectId);

    if(!req.params.projectId) {
        log.error('Project ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Project ID not supplied'])
        );
        return;
    }

    var project = projectCache.getById(req.params.projectId);

    if(!project) {
        var err = "Project with id " + req.params.projectId + " does not exist";
        log.error(err);
        apiUtils.handleResultSet(res, 422,
            new ApiResponse(null, [err])
        );
        return;
    }

    projectDao.addOurPersonToProject(project, newPerson, function(err, person) {
        log.trace('Adding a person: ' + person.role);
        if(err) {
            log.debug('Error adding person with id = ' + person.id);

            apiUtils.handleResultSet(res, 500,
                new ApiResponse(null, ['Error adding person'])
            );
            return;
        } else {
            log.info('Person with id = ' + person.id + ' has been added to ' + project.id);

            projectCache.refreshProjectCache();
            apiUtils.handleResultSet(res, 200,
                new ApiResponse({personId: person.id}, ['Team member has been added'])
            );
        }
    });
};

/**
 * Update team member
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiUpdateTeamMember = function(req, res) {
    let personData = Person.fromJson(req.body.person);
    personData.setId(req.params.personId);

    log.info('Updating a team member in project ID: ' + req.params.projectId);

    if(!req.params.projectId) {
        log.error('Project ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Project ID not supplied'])
        );
        return;
    }

    var project = projectCache.getById(req.params.projectId);

    if(!project) {
        var err = "Project with id " + req.params.projectId + " does not exist";
        log.error(err);
        apiUtils.handleResultSet(res, 422,
            new ApiResponse(null, [err])
        );
        return;
    }

    projectDao.updateOurPersonInProject(project, personData, function(err, person) {
        log.trace('Updating a person: ' + person.id);
        if(err) {
            log.debug('Error updating person with id = ' + person.id);

            apiUtils.handleResultSet(res, 500,
                new ApiResponse(null, ['Error updating person'])
            );
            return;
        } else {
            log.info('Person with id = ' + person.id + ' has been updated in ' + project.id);

            projectCache.refreshProjectCache();
            apiUtils.handleResultSet(res, 200,
                new ApiResponse({personId: person.id}, ['Team member has been updated'])
            );
        }
    });
};

/**
 * Remove a team member
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiRemoveTeamMember = function(req, res) {
    var personId = req.params.personId;

    log.info('Removing a new team member ' + personId + 'from project ID: ' + req.params.projectId);

    if(!personId) {
        log.error('Person ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Person ID not supplied'])
        );
        return;
    }

    var project = projectCache.getById(req.params.projectId);

    if(!project) {
        var err = "Project with id " + req.params.projectId + " does not exist";
        log.error(err);
        apiUtils.handleResultSet(res, 422,
            new ApiResponse(null, [err])
        );
        return;
    }

    projectDao.removeOurPersonFromProject(project, personId, function(err, project) {
        if(err) {
            log.debug('Error removing person with id = ' + personId);

            apiUtils.handleResultSet(res, 500,
                new ApiResponse(null, ['Error adding person'])
            );
            return;
        } else {
            log.info('Person with id = ' + personId + ' has been removed from ' + project.id);

            projectCache.refreshProjectCache();
            apiUtils.handleResultSet(res, 200,
                new ApiResponse({personId: personId}, ['Team member has been removed'])
            );
        }
    });
};

// JSON data of a project
Controller.prototype.handleApiEditProject = function(req, res) {
    var project = projectCache.getById(req.params.projectId);

    if(!project) {
        log.debug('Error updating project. Project with given ID was not found.');
        apiUtils.handleResultSet(res, 422, 
            new ApiResponse(null, ['Error updating project. Project with given ID was not found.'])
        );
    } else {
        project.setName(req.body.name);
        project.setDescription(req.body.description);
        project.setLocation(req.body.location);
        project.setPhase(req.body.phase);

        projectDao.addProject(project, function(err, editedProject) {
            log.trace('Updating project: ' + JSON.stringify(project));
            if(err) {
                log.debug('Error updating project with id = ' + project.id);
    
                apiUtils.handleResultSet(res, 500, 
                    new ApiResponse(null, ['Error updating project'])
                );
            } else {
                log.debug('Project with id = ' + editedProject.id + ' has been updated');
    
                projectCache.refreshProjectCache();
                apiUtils.handleResultSet(res, 200, 
                    new ApiResponse({projectId: editedProject.id}, ['The project has been updated'])
                );
            }
        });
    }
};

// All the data as JSON
Controller.prototype.handleApi = function(req, res) {
    res.json(projectCache.getAll());
};

// Project info
Controller.prototype.handleProjectIdSlug = function(req, res) {
    var data = projectCache.getById(req.params.id);
    res.render('project', {
        "data": data,
        "phase_order": phase_order
    });
};

// Prototype version of project info 
Controller.prototype.handleSlugPrototype = function(req, res) {
    var data = projectCache.getById(req.params.id);
    if (typeof data.prototype == 'undefined') {
        res.render('no-prototype', {
            "data": data
        });
    } else {
        res.redirect(data.prototype);
    }
};

// Add project form
Controller.prototype.handleAddProject = function(req, res) {
    var id = req.params.id;
    res.render('add-project');
};

/**
 * Render Edit team memberspage
 *
 * @param req
 * @param res
 */
Controller.prototype.handleEditOurTeam = function (req, res) {
    var id = req.params.id;

    var project = projectCache.getById(id);

    res.render('edit-our-team', {
        projectName: project.name,
        projectId: id,
        teamMembers: project.ourTeam
    });
};

/**
 * Render Edit team member page
 *
 * @param req
 * @param res
 */
Controller.prototype.handleEditTeamMember = function (req, res) {
    var projectId = req.params.projectId;
    var personId = req.params.personId;

    var project = projectCache.getById(projectId);
    var person = _.find(project.ourTeam, {id: personId});

    res.render('edit-person', {
        projectName: project.name,
        projectId: projectId,
        person: person
    });
};

// Edit project form
Controller.prototype.handleEditProject = function(req, res) {
    var id = req.params.id;
    var project = projectCache.getById(id);
    res.render('edit-project', {
        project: project
    });
};

/**
 * @param  {String} groupBy Name of the field by which the projects will be grouped
 * @param  {String} path Router path, ex: '/location'
 * @param  {String[]} [rowOrder] Order of values by which to group the projects, default: alphabetical
 */
Controller.prototype.setupIndexPageRoute = function(groupBy, path, rowOrder) {
    this.router.get(path, connect.ensureLoggedIn(), function(req, res) {
        var projectList = [];
        Object.keys(projectCache.getAll()).forEach(function(ID) {
            projectList.push(projectCache.getById(ID));
        });
        var data = filterPhaseIfPresent(projectList, req.query.phase);
        data = _.groupBy(data, groupBy);
        var new_data = indexify(data);
        var phases = _.countBy(projectList, 'phase');
        rowOrder = prepareRowOrder(rowOrder, data);

        res.render('index', {
            "data": new_data,
            "phase": req.query.phase,
            "counts": phases,
            "view": groupBy,
            "row_order": rowOrder,
            "phase_order": phase_order
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
    rowOrder = [];
    _.each(data, function(value, key, list) {
        rowOrder.push(key);
    });
    rowOrder.sort();

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

module.exports = Controller;
