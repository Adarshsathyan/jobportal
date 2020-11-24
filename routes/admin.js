var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index',{admin:true})
});
router.get('/users', function(req, res, next) {
  res.render('admin/users',{admin:true})
});
router.get('/employee', function(req, res, next) {
  res.render('admin/employee',{admin:true})
});

module.exports = router;
