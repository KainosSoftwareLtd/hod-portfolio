var express     = require('express'),
    router      = express.Router(),
    fs          = require('fs'),
    connect     = require('connect-ensure-login'),
    controllers = require('./controllers'),
    basicAuth   = require('basic-auth'),
    _           = require('underscore');

try {
  var userFile = fs.readFileSync(__dirname + '/login-password.json').toString();
  var storedUser = JSON.parse(userFile);
} catch(err) {
  console.log(err);
}

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

router.get('/projects/:id/:slug', connect.ensureLoggedIn(), controller.handleProjectIdSlug);
router.get('/projects/:id/:slug/prototype', connect.ensureLoggedIn(), controller.handleSlugPrototype);
router.get('/api', connect.ensureLoggedIn(), controller.handleApi);
router.get('/api/:id', connect.ensureLoggedIn(), controller.handleApiProjectId);

module.exports = router;
