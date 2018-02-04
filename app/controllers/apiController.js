'use strict';
var _ = require('underscore');
var projectCache = require('../dao/projectCache');
var log = require('../logger');
var apiUtils = require('../utils/apiUtils');
var utils = require('../utils/utils');
var projectDao = require('../dao/project');
var Project = require('../models/project');
var Person = require('../models/person');
var ResourceLink = require('../models/resourceLink');
var ApiResponse = apiUtils.ApiResponse;

function ApiController(router) {
    if (!(this instanceof ApiController)) {
        return new ApiController(router);
    }
    this.router = router;
}

// JSON data of a project
ApiController.prototype.handleApiProjectId = function(req, res) {
    projectCache.getById(req.params.id, function(err, data) {
        if (data) {
            res.json(data);
        } else {
            res.json({ error: 'ID not found' });
        }
    });
};

// JSON data of a project
ApiController.prototype.handleApiAddProject = function(req, res) {
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
ApiController.prototype.handleApiAddResource = function(req, res) {
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
ApiController.prototype.handleApiRemoveResource = function(req, res) {
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
ApiController.prototype.handleApiUpdateResource = function(req, res) {
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
ApiController.prototype.handleApiAddTeamMember = function(req, res) {
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
ApiController.prototype.handleApiUpdateTeamMember = function(req, res) {
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
ApiController.prototype.handleApiRemoveTeamMember = function(req, res) {
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
ApiController.prototype.handleApiAddClientTeamMember = function(req, res) {
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
ApiController.prototype.handleApiUpdateClientTeamMember = function(req, res) {
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
ApiController.prototype.handleApiRemoveClientTeamMember = function(req, res) {
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
ApiController.prototype.handleApiUpdateHealthStatus = function(req, res) {
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
ApiController.prototype.handleApiEditProject = function(req, res) {
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
ApiController.prototype.handleApiUpdatePhaseHistory = function(req, res) {
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
ApiController.prototype.handleApiDeletePhaseHistory = function(req, res) {
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
ApiController.prototype.handleApi = function(req, res) {
    projectCache.getAll(function(err, data) {
        res.json(data);
    });
};

// Create or overwrite an entry in project metadata
ApiController.prototype.handleApiUpdateProjectMetadata = function(req, res) {
	 
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

	
module.exports = ApiController;
