var express     = require('express'),
    router      = express.Router(),
    fs          = require('fs'),
    connect     = require('connect-ensure-login'),
    infoController = require('./controllers/infoController'),
    apiController = require('./controllers/apiController'),
    salesController = require('./controllers/salesController'),
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
  let currentHealth = p.health.overall ? p.health.overall.status : null;
  return _.contains(health_order, currentHealth) ? currentHealth: 'unknown';
};

// Information View Routes
var infoController = new infoController(router);
infoController.setupIndexPageRoute('location', '/location');
infoController.setupIndexPageRoute('agency', '/agency');
infoController.setupIndexPageRoute('theme', '/theme');
infoController.setupIndexPageRoute(healthGroupFunc, ['/', '/health'], health_order, 'health');
infoController.setupIndexPageRoute('priority', '/priority', priority_order);

// Project
router.get('/projects/add', connect.ensureLoggedIn(), infoController.handleAddProject);
router.get('/projects/:id/:slug/edit', connect.ensureLoggedIn(), infoController.handleEditProject);
router.get('/projects/:id/:slug', connect.ensureLoggedIn(), infoController.handleProjectIdSlug);

// Health
router.get('/projects/:id/:slug/display-health', connect.ensureLoggedIn(), infoController.handleDisplayHealthStatus);
router.get('/projects/:id/:slug/display-health-history', connect.ensureLoggedIn(), infoController.handleDisplayHealthHistory);
router.get('/projects/:id/:slug/edit-health', connect.ensureLoggedIn(), infoController.handleEditHealthStatus);

// Resources
router.get('/projects/:id/:slug/edit-resources', connect.ensureLoggedIn(), infoController.handleEditResources);
router.get('/projects/:projectId/:slug/resource/:resourceId/edit', connect.ensureLoggedIn(), infoController.handleEditResource);

// Phases
router.get('/projects/:projectId/:slug/edit-phase-history', connect.ensureLoggedIn(), infoController.handleEditPhaseHistory);

// People
router.get('/projects/:id/:slug/edit-our-team', connect.ensureLoggedIn(), infoController.handleEditOurTeam);
router.get('/projects/:projectId/:slug/person/team/:personId/edit', connect.ensureLoggedIn(), infoController.handleEditTeamMember);
router.get('/projects/:id/:slug/edit-client-team', connect.ensureLoggedIn(), infoController.handleEditClientTeam);
router.get('/projects/:projectId/:slug/person/client/:personId/edit', connect.ensureLoggedIn(), infoController.handleEditClientTeamMember);

// Metadata / Tags
router.get('/projects/:id/:slug/edit-project-metadata', connect.ensureLoggedIn(), infoController.handleEditProjectMetadata);


// Sales View Routes
// Project
var salesController = new salesController(router);
router.get('/sales', connect.ensureLoggedIn(), salesController.handleSalesView);

// API Routes
var apiController = new apiController(router);

// Project
router.get('/api', connect.ensureLoggedIn(), apiController.handleApi);
router.get('/api/:id', connect.ensureLoggedIn(), apiController.handleApiProjectId);
router.post('/api/projects', connect.ensureLoggedIn(), apiController.handleApiAddProject);
router.put('/api/projects/:projectId', connect.ensureLoggedIn(), apiController.handleApiEditProject);

// Health
router.put('/api/projects/:projectId/health', connect.ensureLoggedIn(), apiController.handleApiUpdateHealthStatus);

// People
router.post('/api/projects/:projectId/person/team', connect.ensureLoggedIn(), apiController.handleApiAddTeamMember);
router.delete('/api/projects/:projectId/person/team/:personId', connect.ensureLoggedIn(), apiController.handleApiRemoveTeamMember);
router.put('/api/projects/:projectId/person/team/:personId', connect.ensureLoggedIn(), apiController.handleApiUpdateTeamMember);

router.post('/api/projects/:projectId/person/client', connect.ensureLoggedIn(), apiController.handleApiAddClientTeamMember);
router.delete('/api/projects/:projectId/person/client/:personId', connect.ensureLoggedIn(), apiController.handleApiRemoveClientTeamMember);
router.put('/api/projects/:projectId/person/client/:personId', connect.ensureLoggedIn(), apiController.handleApiUpdateClientTeamMember);

// Resources
router.post('/api/projects/:projectId/resource', connect.ensureLoggedIn(), apiController.handleApiAddResource);
router.put('/api/projects/:projectId/resource/:resourceId', connect.ensureLoggedIn(), apiController.handleApiUpdateResource);
router.delete('/api/projects/:projectId/resource/:resourceId', connect.ensureLoggedIn(), apiController.handleApiRemoveResource);

// Phases
router.put('/api/projects/:projectId/phase-history', connect.ensureLoggedIn(), apiController.handleApiUpdatePhaseHistory);
router.delete('/api/projects/:projectId/phase-history', connect.ensureLoggedIn(), apiController.handleApiDeletePhaseHistory);

// Metadata / Tags
router.put('/api/projects/:projectId/project-metadata', connect.ensureLoggedIn(), apiController.handleApiUpdateProjectMetadata);

module.exports = router;