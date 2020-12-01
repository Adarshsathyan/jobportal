var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index',{layout:'./layoutuser'});
});

router.get('/jobs', function(req, res, next) {
  res.render('user/jobs',{layout:'./layoutuser'});
});

router.get('/login', function(req, res, next) {
  res.render('user/login',{layout:null});
});

router.get('/about', function(req, res, next) {
  res.render('user/about',{layout:'./layoutuser'});
});

router.get('/jobdetails', function(req, res, next) {
  res.render('user/job-details',{layout:'./layoutuser'});
});

router.get('/contact', function(req, res, next) {
  res.render('user/contact',{layout:'./layoutuser'});
});
module.exports = router;
