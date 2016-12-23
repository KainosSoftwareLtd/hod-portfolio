var projectDao = require('./dao/project');
var log = require('./logger');

var ProjectCache = function() {};

var cache = {};
var isOutdated = true;
var listeners = [];

/**
 * Refresh the project cache - use only when necessary, refreshProject is better
 */
ProjectCache.refreshProjectCache = function() {
    listeners = [];
    isOutdated = true;
    cache = {};

    projectDao.getAll(function(err, data) {
        if(!data || data.length === 0) {
            log.error("No projects found");
        }

        data.forEach(function(item) {
            cache["" + item.id] = item;
        });
        isOutdated = false;
        listeners.forEach(function(listener) {
            if(listener) {
                listener(err, Object.assign({}, cache));
            }
        });
    });
};

/**
 * Refresh one project
 *
 * @param {string} projectId
 */
ProjectCache.refreshProject = function(projectId) {
    listeners = [];
    isOutdated = true;
    cache["" + projectId] = null;

    projectDao.getOne(projectId, function(err, res) {
        if(res) {
            cache["" + projectId] = res;
        }
        isOutdated = false;
        listeners.forEach(function(listener) {
            if(listener) {
                listener(err, Object.assign({}, cache));
            }
        });
    });
};

/**
 * Calls back with all projects in a map ID -> project
 * 
 * @param {function} callback (err, result), should be an anonymous function
 */
ProjectCache.getAll = function(callback) {
    if(isOutdated) {
        listeners.push(callback);
        // if loading hangs
        setTimeout(function(){
            var idx = listeners.indexOf(callback);
            if(idx >= 0) {
                listeners[idx] = null;
                log.error("Timeout while waiting for projects to populate the cache");
                callback("Cache timeout");
            }
        }, 10000);
    } else {
        callback(null, Object.assign({}, cache))
    }
};

ProjectCache.getById = function(projectId, callback) {
    var proj = cache[projectId];
    if(proj) {
        callback(null, proj);
    } else {
        projectDao.getOne(projectId, function(err, res) {
            if(res) {
                cache["" + projectId] = res;
            }
            callback(err, res);
        });
    }
};

// init
ProjectCache.refreshProjectCache();

module.exports = ProjectCache;
