var projectDao = require('./dao/project');
var log = require('./logger');

var ProjectCache = function() {};

var cache = {};

/**
 * Refresh the project cache
 */
ProjectCache.refreshProjectCache = function() {
    cache = {};

    projectDao.getAll(function(err, data) {
        if(!data || data.length === 0) {
            log.error("No projects found");
        }

        data.forEach(function(item) {
            cache["" + item.id] = item;
        });
    });
}

/**
 * Returns all projects in a map  ID -> project
 * 
 * @returns {<projectId>: project_data} map
 */
ProjectCache.getAll = function() {
    return cache;
}

ProjectCache.getById = function(projectId) {
    return cache[projectId];
}

// init
ProjectCache.refreshProjectCache();

module.exports = ProjectCache;
