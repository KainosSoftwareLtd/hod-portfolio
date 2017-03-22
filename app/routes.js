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
  'unknown',
  'risk',
  'fair',
  'good'
];

var healthGroupFunc = function(p) {
    return p.health.overall ? p.health.overall.status : 'unknown';
};

var controller = new controllers(router);
controller.setupIndexPageRoute('location', '/location');
controller.setupIndexPageRoute('agency', '/agency');
controller.setupIndexPageRoute('theme', '/theme');
controller.setupIndexPageRoute(healthGroupFunc, ['/', '/health'], health_order, 'health');
controller.setupIndexPageRoute('priority', '/priority', priority_order);

router.get('/projects/add', connect.ensureLoggedIn(), controller.handleAddProject);
router.get('/projects/:id/:slug/edit-our-team', connect.ensureLoggedIn(), controller.handleEditOurTeam);
router.get('/projects/:id/:slug/edit-resources', connect.ensureLoggedIn(), controller.handleEditResources);
router.get('/projects/:id/:slug/edit-health', connect.ensureLoggedIn(), controller.handleEditHealthStatus);
router.get('/projects/:projectId/:slug/edit-phase-history', connect.ensureLoggedIn(), controller.handleEditPhaseHistory);
router.get('/projects/:id/:slug/display-health', connect.ensureLoggedIn(), controller.handleDisplayHealthStatus);
router.get('/projects/:projectId/:slug/resource/:resourceId/edit', connect.ensureLoggedIn(), controller.handleEditResource);
router.get('/projects/:projectId/:slug/person/team/:personId/edit', connect.ensureLoggedIn(), controller.handleEditTeamMember);
router.get('/projects/:id/:slug/edit-client-team', connect.ensureLoggedIn(), controller.handleEditClientTeam);
router.get('/projects/:projectId/:slug/person/client/:personId/edit', connect.ensureLoggedIn(), controller.handleEditClientTeamMember);
router.get('/projects/:id/:slug/edit', connect.ensureLoggedIn(), controller.handleEditProject);
router.get('/projects/:id/:slug', connect.ensureLoggedIn(), controller.handleProjectIdSlug);

router.get('/api', connect.ensureLoggedIn(), controller.handleApi);
router.put('/api/projects/:projectId', connect.ensureLoggedIn(), controller.handleApiEditProject);
router.put('/api/projects/:projectId/health', connect.ensureLoggedIn(), controller.handleApiUpdateHealthStatus);
router.get('/api/:id', connect.ensureLoggedIn(), controller.handleApiProjectId);
router.post('/api/projects/:projectId/person/team', connect.ensureLoggedIn(), controller.handleApiAddTeamMember);
router.post('/api/projects/:projectId/resource', connect.ensureLoggedIn(), controller.handleApiAddResource);
router.delete('/api/projects/:projectId/person/team/:personId', connect.ensureLoggedIn(), controller.handleApiRemoveTeamMember);
router.delete('/api/projects/:projectId/resource/:resourceId', connect.ensureLoggedIn(), controller.handleApiRemoveResource);
router.put('/api/projects/:projectId/person/team/:personId', connect.ensureLoggedIn(), controller.handleApiUpdateTeamMember);
router.post('/api/projects/:projectId/person/client', connect.ensureLoggedIn(), controller.handleApiAddClientTeamMember);
router.delete('/api/projects/:projectId/person/client/:personId', connect.ensureLoggedIn(), controller.handleApiRemoveClientTeamMember);
router.put('/api/projects/:projectId/person/client/:personId', connect.ensureLoggedIn(), controller.handleApiUpdateClientTeamMember);
router.put('/api/projects/:projectId/resource/:resourceId', connect.ensureLoggedIn(), controller.handleApiUpdateResource);
router.put('/api/projects/:projectId/phase-history', connect.ensureLoggedIn(), controller.handleApiUpdatePhaseHistory);
router.delete('/api/projects/:projectId/phase-history', connect.ensureLoggedIn(), controller.handleApiDeletePhaseHistory);
router.post('/api/projects', connect.ensureLoggedIn(), controller.handleApiAddProject);

module.exports = router;
