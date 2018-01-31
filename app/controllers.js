'use strict';
var _ = require('underscore');
var connect = require('connect-ensure-login');
var projectCache = require('./projectCache');
var log = require('./logger');
var apiUtils = require('./apiUtils');
var utils = require('./utils');
var projectDao = require('./dao/project');
var Project = require('./models/project');
var Person = require('./models/person');
var ResourceLink = require('./models/resourceLink');
var ApiResponse = apiUtils.ApiResponse;

function Controller(router) {
    if (!(this instanceof Controller)) {
        return new Controller(router);
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

// JSON data of a project
Controller.prototype.handleApiProjectId = function(req, res) {
    projectCache.getById(req.params.id, function(err, data) {
        if (data) {
            res.json(data);
        } else {
            res.json({ error: 'ID not found' });
        }
    });
};

// JSON data of a project
Controller.prototype.handleApiAddProject = function(req, res) {
    let newProject = new Project(req.body.name, req.body.description);
    newProject.setLocation(req.body.location);
    newProject.setPhaseHistoryEntry(req.body.phase, "Started", req.body.month, req.body.year);
    newProject.setIsFinished(req.body.isFinished);
    newProject.setCustomer(req.body.customer);
    newProject.setSector(req.body.sector);
    newProject.setDepartment(req.body.department);
    newProject.setAgency(req.body.agency);

    projectDao.addProject(newProject, function(err, project) {
        log.trace('Adding project: ' + project.name);
        if(err) {
            log.debug('Error adding project with id = ' + project.id);

            apiUtils.handleResultSet(res, 500,
                new ApiResponse(null, ['Error adding project'])
            );
        } else {
            log.debug('Project with id = ' + project.id + ' has been added');

            projectCache.refreshProject(project.id);
            apiUtils.handleResultSet(res, 200,
                new ApiResponse({projectId: project.id}, ['The project has been added'])
            );
        }
    });
};

/**
 * Add resource
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiAddResource = function(req, res) {
    let newResource = new ResourceLink(req.body.name, req.body.url);

    log.info('Adding a new resource to project ID: ' + req.params.projectId);

    if(!req.params.projectId) {
        log.error('Project ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Project ID not supplied'])
        );
        return;
    }

    projectCache.getById(req.params.projectId, function (error, project) {
        if(!project) {
            var err = "Project with id " + req.params.projectId + " does not exist";
            log.error(err);
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, [err])
            );
            return;
        }

        projectDao.addResourceToProject(project, newResource, function(err, resource) {
            log.trace('Adding a resource: ' + resource.role);
            if(err) {
                log.debug('Error adding resource with id = ' + resource.id);

                apiUtils.handleResultSet(res, 500,
                    new ApiResponse(null, ['Error adding resource'])
                );
                return;
            } else {
                log.info('Resource with id = ' + resource.id + ' has been added to ' + project.id);

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({resourceId: resource.id}, ['Resource has been added'])
                );
            }
        });
    });
};

/**
 * Remove a resource link
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiRemoveResource = function(req, res) {
    var resourceId = req.params.resourceId;

    log.info('Removing a resource ' + resourceId + 'from project ID: ' + req.params.projectId);

    if(!resourceId) {
        log.error('Resource ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Resource ID not supplied'])
        );
        return;
    }

    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            var err = "Project with id " + req.params.projectId + " does not exist";
            log.error(err);
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, [err])
            );
            return;
        }

        projectDao.removeResourceFromProject(project, resourceId, function(err, project) {
            if(err) {
                log.debug('Error removing resource with id = ' + resourceId);

                apiUtils.handleResultSet(res, 500,
                    new ApiResponse(null, ['Error adding resource'])
                );
                return;
            } else {
                log.info('Resource with id = ' + resourceId + ' has been removed from ' + project.id);

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({resourceId: resourceId}, ['Resource has been removed'])
                );
            }
        });
    });
};

/**
 * Update resource
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiUpdateResource = function(req, res) {
    let resourceData = ResourceLink.fromJson(req.body.resource);
    resourceData.setId(req.params.resourceId);

    log.info('Updating a resource in project ID: ' + req.params.projectId);

    if(!req.params.projectId) {
        log.error('Project ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Project ID not supplied'])
        );
        return;
    }

    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            var err = "Project with id " + req.params.projectId + " does not exist";
            log.error(err);
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, [err])
            );
            return;
        }

        projectDao.updateResourceInProject(project, resourceData, function(err, resource) {
            log.trace('Updating a resource: ' + resource.id);
            if(err) {
                log.debug('Error updating resource with id = ' + resource.id);

                apiUtils.handleResultSet(res, 500,
                    new ApiResponse(null, ['Error updating resource'])
                );
                return;
            } else {
                log.info('Resource with id = ' + resource.id + ' has been updated in ' + project.id);

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({resourceId: resource.id}, ['Resource has been updated'])
                );
            }
        });
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

    projectCache.getById(req.params.projectId, function(error, project) {
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

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({personId: person.id}, ['Team member has been added'])
                );
            }
        });
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

    projectCache.getById(req.params.projectId, function(error, project) {
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

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({personId: person.id}, ['Team member has been updated'])
                );
            }
        });
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

    log.info('Removing a team member ' + personId + 'from project ID: ' + req.params.projectId);

    if(!personId) {
        log.error('Person ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Person ID not supplied'])
        );
        return;
    }

    projectCache.getById(req.params.projectId, function(error, project) {
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

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({personId: personId}, ['Team member has been removed'])
                );
            }
        });
    });
};

/**
 * Add client team member
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiAddClientTeamMember = function(req, res) {
    let newPerson = new Person(req.body.name, req.body.role);
    newPerson.setEmail(req.body.email);
    newPerson.setMobile(req.body.mobile);
    newPerson.setSkype(req.body.skype);
    newPerson.setSlack(req.body.slack);

    log.info('Adding a new client team member to project ID: ' + req.params.projectId);

    if(!req.params.projectId) {
        log.error('Project ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Project ID not supplied'])
        );
        return;
    }

    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            var err = "Project with id " + req.params.projectId + " does not exist";
            log.error(err);
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, [err])
            );
            return;
        }

        projectDao.addClientToProject(project, newPerson, function(err, person) {
            log.trace('Adding a person: ' + person.role);
            if(err) {
                log.debug('Error adding person with id = ' + person.id);

                apiUtils.handleResultSet(res, 500,
                    new ApiResponse(null, ['Error adding person'])
                );
                return;
            } else {
                log.info('Person with id = ' + person.id + ' has been added to ' + project.id);

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({personId: person.id}, ['Client team member has been added'])
                );
            }
        });
    });
};

/**
 * Update client team member
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiUpdateClientTeamMember = function(req, res) {
    let personData = Person.fromJson(req.body.person);
    personData.setId(req.params.personId);

    log.info('Updating a client team member in project ID: ' + req.params.projectId);

    if(!req.params.projectId) {
        log.error('Project ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Project ID not supplied'])
        );
        return;
    }

    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            var err = "Project with id " + req.params.projectId + " does not exist";
            log.error(err);
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, [err])
            );
            return;
        }

        projectDao.updateClientInProject(project, personData, function(err, person) {
            log.trace('Updating a person: ' + person.id);
            if(err) {
                log.debug('Error updating person with id = ' + person.id);

                apiUtils.handleResultSet(res, 500,
                    new ApiResponse(null, ['Error updating person'])
                );
                return;
            } else {
                log.info('Person with id = ' + person.id + ' has been updated in ' + project.id);

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({personId: person.id}, ['Client team member has been updated'])
                );
            }
        });
    });
};

/**
 * Remove a client team member
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiRemoveClientTeamMember = function(req, res) {
    var personId = req.params.personId;

    log.info('Removing a client team member ' + personId + 'from project ID: ' + req.params.projectId);

    if(!personId) {
        log.error('Person ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Person ID not supplied'])
        );
        return;
    }

    var project = projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            var err = "Project with id " + req.params.projectId + " does not exist";
            log.error(err);
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, [err])
            );
            return;
        }

        projectDao.removeClientFromProject(project, personId, function(err, project) {
            if(err) {
                log.debug('Error removing person with id = ' + personId);

                apiUtils.handleResultSet(res, 500,
                    new ApiResponse(null, ['Error removing person'])
                );
                return;
            } else {
                log.info('Person with id = ' + personId + ' has been removed from ' + project.id);

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({personId: personId}, ['Client team member has been removed'])
                );
            }
        });
    });
};

/**
 * Change projects health status
 *
 * @param req
 * @param res
 */
Controller.prototype.handleApiUpdateHealthStatus = function(req, res) {
    var health = req.body.health;

    log.info('Changing health status in project ID: ' + req.params.projectId);

    if(!req.params.projectId) {
        log.error('Project ID not supplied');
        apiUtils.handleResultSet(res, 400,
            new ApiResponse(null, ['Project ID not supplied'])
        );
        return;
    }

    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            var err = "Project with id " + req.params.projectId + " does not exist";
            log.error(err);
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, [err])
            );
            return;
        }

        project.setHealth(health.type, health.status,
            { name: req.user.displayName, email: req.user.email },
            health.comment, health.link.name, health.link.url
        );

        projectDao.addProject(project, function(err, person) {
            log.trace('Updating project health status to: ' + health.status);
            if(err) {
                log.debug('Error updating project health status for project with id = ' + project.id);

                apiUtils.handleResultSet(res, 500,
                    new ApiResponse(null, ['Error updating project health status'])
                );
                return;
            } else {
                log.info('Project with id = ' + project.id + ' has been updated with new health status');

                projectCache.refreshProject(project.id);
                apiUtils.handleResultSet(res, 200,
                    new ApiResponse({health: health}, ['Project health status has been updated'])
                );
            }
        });
    });
};

// JSON data of a project
Controller.prototype.handleApiEditProject = function(req, res) {
    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            log.debug('Error updating project. Project with given ID was not found.');
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, ['Error updating project. Project with given ID was not found.'])
            );
        } else {
            project.setName(req.body.name);
            project.setDescription(req.body.description);
            project.setLocation(req.body.location);
            project.setIsFinished(req.body.isFinished === "true");
            project.setCustomer(req.body.customer);
            project.setSector(req.body.sector);
            project.setDepartment(req.body.department);
            project.setAgency(req.body.agency);
			
            projectDao.addProject(project, function(err, editedProject) {
                log.trace('Updating project with id = ' + project.id);
                if(err) {
                    log.debug('Error updating project with id = ' + project.id);

                    apiUtils.handleResultSet(res, 500,
                        new ApiResponse(null, ['Error updating project'])
                    );
                } else {
                    log.debug('Project with id = ' + editedProject.id + ' has been updated');

                    projectCache.refreshProject(editedProject.id);
                    apiUtils.handleResultSet(res, 200,
                        new ApiResponse({projectId: editedProject.id}, ['The project has been updated'])
                    );
                }
            });
        }
    });
};

// Create or overwrite an entry in phase history
Controller.prototype.handleApiUpdatePhaseHistory = function(req, res) {
    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            log.debug('Error updating project history. Project with given ID was not found.');
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, ['Error updating project history. Project with given ID was not found.'])
            );
        } else {
            project.setPhaseHistoryEntry(req.body.phase, req.body.label, req.body.month, req.body.year);

            projectDao.addProject(project, function(err, editedProject) {
                log.trace('Updating project history. ID of the project: ' + project.id);
                if(err) {
                    log.debug('Error updating history of a project with id = ' + project.id);

                    apiUtils.handleResultSet(res, 500,
                        new ApiResponse(null, ['Error updating project history'])
                    );
                } else {
                    log.debug('History of a project with id = ' + editedProject.id + ' has been updated');

                    projectCache.refreshProject(editedProject.id);
                    apiUtils.handleResultSet(res, 200,
                        new ApiResponse({projectId: editedProject.id}, ['The project history has been updated'])
                    );
                }
            });
        }
    });
};

// Delete an entry from phase history
Controller.prototype.handleApiDeletePhaseHistory = function(req, res) {
    projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            log.debug('Error removing from project history. Project with given ID was not found.');
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, ['Error removing from project history. Project with given ID was not found.'])
            );
        } else {
            project.removeFromPhaseHistory(req.body.phase, req.body.label);

            projectDao.addProject(project, function(err, editedProject) {
                log.trace('Removing an entry from phase history. ' +
                    'Label: "' + req.body.label + '" ' +
                    'Phase: "' + req.body.phase + '"');

                if(err) {
                    log.debug('Error removing an entry from the history of a project with id = ' + project.id);

                    apiUtils.handleResultSet(res, 500,
                        new ApiResponse(null, ['Error removing an entry from project history'])
                    );
                } else {
                    log.debug('History of a project with id = ' + editedProject.id + ' has been updated');

                    projectCache.refreshProject(editedProject.id);
                    apiUtils.handleResultSet(res, 200,
                        new ApiResponse({projectId: editedProject.id}, ['An entry from project history has been removed'])
                    );
                }
            });
        }
    });
};

// All the data as JSON
Controller.prototype.handleApi = function(req, res) {
    projectCache.getAll(function(err, data) {
        res.json(data);
    });
};

// Project info
Controller.prototype.handleProjectIdSlug = function(req, res) {
    projectCache.getById(req.params.id, function(error, data) {
        res.render('project', {
            "data": data,
            "phase_order": phase_order,
            "sectorTypes": sectorTypes
        });
    });
};

// Add project form
Controller.prototype.handleAddProject = function(req, res) {
    res.render('add-project');
};

/**
 * Render Edit resources page
 *
 * @param req
 * @param res
 */
Controller.prototype.handleEditResources = function (req, res) {
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
Controller.prototype.handleEditResource = function (req, res) {
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
Controller.prototype.handleEditPhaseHistory = function (req, res) {
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
Controller.prototype.handleEditOurTeam = function (req, res) {
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
Controller.prototype.handleEditTeamMember = function (req, res) {
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
Controller.prototype.handleEditClientTeam = function (req, res) {
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
Controller.prototype.handleEditClientTeamMember = function (req, res) {
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
Controller.prototype.handleEditHealthStatus = function (req, res) {
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
Controller.prototype.handleDisplayHealthStatus = function (req, res) {
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
Controller.prototype.handleDisplayHealthHistory = function (req, res) {
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
Controller.prototype.handleEditProject = function(req, res) {
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
Controller.prototype.setupIndexPageRoute = function(groupBy, path, rowOrder, viewType) {
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
Controller.prototype.handleEditProjectMetadata = function (req, res) {
    var id = req.params.id;
    projectCache.getById(id, function(error, project) {
        res.render('edit-project-metadata', {
            project: project
        });
    });
};

// Create or overwrite an entry in project metadata
Controller.prototype.handleApiUpdateProjectMetadata = function(req, res) {
	 
  projectCache.getById(req.params.projectId, function(error, project) {
        if(!project) {
            log.debug('Error updating project metadata. Project with given ID was not found.');
            apiUtils.handleResultSet(res, 422,
                new ApiResponse(null, ['Error updating project metadata. Project with given ID was not found.'])
            );
        } else {
            project.setProjectMetadata(req.body);

            projectDao.addProject(project, function(err, editedProject) {
                log.trace('Updating project metadata. ID of the project: ' + project.id);
                if(err) {
                    log.debug('Error updating metadata of a project with id = ' + project.id);

                    apiUtils.handleResultSet(res, 500,
                        new ApiResponse(null, ['Error updating project metadata'])
                    );
                } else {
                    log.debug('Metadata of a project with id = ' + editedProject.id + ' has been updated');

                    projectCache.refreshProject(editedProject.id);
                    apiUtils.handleResultSet(res, 200,
                        new ApiResponse({projectId: editedProject.id}, ['The project metadata has been updated'])
                    );
                }
            });
        }
    });
};

	
module.exports = Controller;
