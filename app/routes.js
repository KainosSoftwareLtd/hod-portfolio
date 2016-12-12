var express     = require('express'),
    router      = express.Router(),
    fs          = require('fs'),
    connect     = require('connect-ensure-login'),
    controllers = require('./controllers'),
    basicAuth   = require('basic-auth'),
    _           = require('underscore');
    log         = require('./logger');

var priority_descriptions = {
  "Low": "Non-urgent services and those that have short-term benefit."
};

var priority_order = [
  'Top',
  'High',
  'Medium',
  'Low'
];

var health_order = [
  'Good',
  'Fair',
  'Critical'
];

var controller = new controllers(router);
controller.setupIndexPageRoute('location', ['/', '/location']);
controller.setupIndexPageRoute('agency', '/agency');
controller.setupIndexPageRoute('theme', '/theme');
controller.setupIndexPageRoute('health', '/health', health_order);
controller.setupIndexPageRoute('priority', '/priority', priority_order);

router.get('/projects/add', connect.ensureLoggedIn(), controller.handleAddProject);
router.get('/projects/:id/:slug/edit', connect.ensureLoggedIn(), controller.handleEditProject);
router.get('/projects/:id/:slug', connect.ensureLoggedIn(), controller.handleProjectIdSlug);
router.get('/projects/:id/:slug/prototype', connect.ensureLoggedIn(), controller.handleSlugPrototype);

router.get('/api', connect.ensureLoggedIn(), controller.handleApi);
router.put('/api/projects/:projectId', connect.ensureLoggedIn(), controller.handleApiEditProject);
router.get('/api/:id', connect.ensureLoggedIn(), controller.handleApiProjectId);
router.post('/api/projects', connect.ensureLoggedIn(), controller.handleApiAddProject);

module.exports = router;
