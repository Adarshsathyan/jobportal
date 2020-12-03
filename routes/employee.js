const { response } = require('express');
var express = require('express');
var router = express.Router();
var employeeHelper=require('../helpers/employee-helper')

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.loggedIn){
    res.redirect('/employee/home')
  }else{
    res.render('employee/login',{layout:null});
  }
   
  
  
});
router.post('/', function(req, res) {
  employeeHelper.employeeAuth(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.employee=response.employee
      res.redirect('/employee/home')
    }else{
      res.redirect('/employee')
    }
    
  })


});

router.get('/signup', function(req, res) {
  if(req.session.loggedIn){
    res.redirect('/employee/home')
  }else{
    res.render('employee/signup',{layout:null,login:req.session.signErr});
    req.session.signErr=false
  }
  
});

router.post('/signup', function(req, res) {
  employeeHelper.employeeSignup(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
    req.session.employee=response
    res.redirect('/employee/home')
    }else{
      req.session.signErr=true
      res.redirect('/employee/signup')
    }
    
  })
  
});
router.get('/logout',function(req,res){
  req.session.destroy()
  res.redirect('/employee')
})

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

router.get('/home', function(req, res) {
  if(req.session.loggedIn){
    res.render('employee/index',{employee:true});
  }else{
    res.redirect('/employee')
  }
  
});


module.exports = router;
