var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('employee/index',{employee:true});
});

router.get('/jobs', function(req, res) {
  res.render('employee/jobs',{employee:true});
});

router.get('/requests', function(req, res) {
  res.render('employee/requests',{employee:true});
});
router.get('/approved', function(req, res) {
  res.render('employee/approved',{employee:true});
});
router.get('/addjob', function(req, res) {
  res.render('employee/add-job',{employee:true});
});

router.get('/login', function(req, res) {
  res.render('employee/login',{layout:null});
});


module.exports = router;
