var fileStore = require('../fileStore');
var Project = require('../models/project');
var log = require('../logger');

var Projects = function() {};

/**
 * Adds a project to the datastore
 * 
 * @param {Project} Project to be persisted
 */
Projects.addProject = function(project, callback) {
    log.info("Creating a project");
    if (!project.id) {
        project.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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

module.exports = Projects;