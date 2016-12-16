var fileStore = require('../fileStore');
var Project = require('../models/project');
var log = require('../logger');
var utils = require('../utils');
var _ = require('underscore');

var Projects = function() {};

/**
 * Adds a project to the datastore
 * 
 * @param {Project} Project to be persisted
 */
Projects.addProject = function(project, callback) {
    log.info("Creating a project");
    if (!project.id) {
        project.id = utils.generateGUID();
        log.debug("New ID generated: " + project.id);
    }

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, project);
        }
    });
};

Projects.getAll = function(callback) {
    fileStore.getAllProjects(function(errors, data) {
        var projectList = data.map(function(item) {
            return Project.fromJson(item);
        });
        callback(errors, projectList);
    });
};

/**
 * Adds a project team member.
 *
 * @param {Project} project Project to which we are adding the person to
 * @param {Person} person person being added
 * @param {function} callback (err, data) callback
 */
Projects.addOurPersonToProject = function(project, person, callback) {
    log.info("Creating a team member");
    if (!person.id) {
        person.id = utils.generateGUID();
        log.debug("New ID generated: " + person.id);
    }

    project.addToOurTeam(person);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, person);
        }
    });
};

/**
 * Updates a project team member.
 *
 * @param {Project} project Project in which we are updating the person
 * @param {Person} person person being updated
 * @param {function} callback (err, data) callback
 */
Projects.updateOurPersonInProject = function(project, person, callback) {
    log.info("Updating a team member");
    if (!person.id) {
        log.error("Person has no ID");
        callback("Person has no ID", false);
        return;
    }

    var personFromCache = _.find(project.ourTeam, {id: person.id});

    if (!personFromCache) {
        log.error("Person not found");
        callback("Person not found", false);
        return;
    }

    Object.assign(personFromCache, person);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, personFromCache);
        }
    });
};

/**
 * Removes a project team member.
 *
 * @param {Project} project Project from which we are removing the person
 * @param {String} personId ID of person being removed
 * @param {function} callback (err, data) callback
 */
Projects.removeOurPersonFromProject = function(project, personId, callback) {
    log.info("Removing a team member");
    if (!personId) {
        log.error("Person has no ID");
        callback("Person has no ID", false);
        return;
    }

    project.removeFromOurTeam(personId);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, project);
        }
    });
};

/**
 * Adds a client team member to a project.
 *
 * @param {Project} project Project to which we are adding the person
 * @param {Person} person person being added
 * @param {function} callback (err, data) callback
 */
Projects.addClientToProject = function(project, person, callback) {
    log.info("Creating a client team member");
    if (!person.id) {
        person.id = utils.generateGUID();
        log.debug("New ID generated: " + person.id);
    }

    project.addToClientTeam(person);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, person);
        }
    });
};

/**
 * Updates a project client team member.
 *
 * @param {Project} project Project in which we are updating the person
 * @param {Person} person person being updated
 * @param {function} callback (err, data) callback
 */
Projects.updateClientInProject = function(project, person, callback) {
    log.info("Updating a client team member");
    if (!person.id) {
        log.error("Person has no ID");
        callback("Person has no ID", false);
        return;
    }

    var personFromCache = _.find(project.clientTeam, {id: person.id});

    if (!personFromCache) {
        log.error("Person not found");
        callback("Person not found", false);
        return;
    }

    Object.assign(personFromCache, person);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, personFromCache);
        }
    });
};

/**
 * Removes a project client team member.
 *
 * @param {Project} project Project from which we are removing the person
 * @param {String} personId ID of person being removed
 * @param {function} callback (err, data) callback
 */
Projects.removeClientFromProject = function(project, personId, callback) {
    log.info("Removing a clieant team member");
    if (!personId) {
        log.error("Person has no ID");
        callback("Person has no ID", false);
        return;
    }

    project.removeFromClientTeam(personId);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, project);
        }
    });
};

/**
 * Adds a resource link to a project
 *
 * @param {Project} project Project to which we are adding the resource
 * @param {ResourceLink} resource resource being added
 * @param {function} callback (err, data) callback
 */
Projects.addResourceToProject = function(project, resource, callback) {
    log.info("Creating a resource");
    if (!resource.id) {
        resource.id = utils.generateGUID();
        log.debug("New ID generated: " + resource.id);
    }

    project.addResource(resource);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, resource);
        }
    });
};

/**
 * Updates a resource
 *
 * @param {Project} project Project in which we are updating the resource
 * @param {Resource} resource resource being updated
 * @param {function} callback (err, data) callback
 */
Projects.updateResourceInProject = function(project, resource, callback) {
    log.info("Updating a resource");
    if (!resource.id) {
        log.error("Resource has no ID");
        callback("Resource has no ID", false);
        return;
    }

    var resourceFromCache = _.find(project.resources, {id: resource.id});

    if (!resourceFromCache) {
        log.error("Resource not found");
        callback("Resource not found", false);
        return;
    }

    Object.assign(resourceFromCache, resource);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, resourceFromCache);
        }
    });
};

/**
 * Removes a resource
 *
 * @param {Project} project Project from which we are removing the resource
 * @param {String} resourceId ID of resource being removed
 * @param {function} callback (err, data) callback
 */
Projects.removeResourceFromProject = function(project, resourceId, callback) {
    log.info("Removing a resource");
    if (!resourceId) {
        log.error("Resource has no ID");
        callback("Resource has no ID", false);
        return;
    }

    project.removeFromResources(resourceId);

    fileStore.uploadObjectAsJsonFile(project.id, project, function(err, data) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, project);
        }
    });
};

module.exports = Projects;

