var express = require('express');
var router = express.Router();
var userHelper=require('../helpers/user-helper')


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userloggedIn){
    res.render('user/index',{layout:'./layoutuser',user:req.session.user});
  }else{
    res.render('user/index',{layout:'./layoutuser'});
  }
  
});

router.get('/jobs', function(req, res, next) {
  userHelper.getAllJobs().then((jobs)=>{
    res.render('user/jobs',{layout:'./layoutuser',jobs:jobs});
  })
  
});
router.get('/jobdetails/:id', function(req, res, next) {
  userHelper.getJobDetails(req.params.id).then((jobdetail)=>{
    console.log(jobdetail);
    res.render('user/job-detail',{layout:'./layoutuser',job:jobdetail});
  })
  
});

router.get('/login', function(req, res, next) {
  if(req.session.userloggedIn){
    res.redirect('/')
  }
  res.render('user/login',{layout:null,login:req.session.signErr,block:req.session.userBlockErr});
  req.session.signErr=false
});
router.post('/login', function(req,res) {
  userHelper.userLogin(req.body).then((response)=>{
    if(response.status){
      req.session.userloggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else if(response.user){
      req.session.userBlockErr=true
      res.redirect('/login')
    }else{
      req.session.signErr=true
      res.redirect('/login')
    }
  })
});
router.get('/logout', function(req, res, next) {
  req.session.userloggedIn=null
  res.redirect('/')
});
router.get('/signup', function(req, res, next) {
  if(req.session.userloggedIn){
    res.redirect('/')
  }else{
    res.render('user/signup',{layout:null,login:req.session.signErr});
    req.session.signErr=false
  }
});
router.post('/signup', function(req, res, next) {
  userHelper.userSignup(req.body).then((response)=>{
    if(response.name){
      req.session.userloggedIn=true
    req.session.user=response
    res.redirect('/')
    }else{
      req.session.signErr=true
      res.redirect('/signup')
    }
  })
});
router.get('/phone-login', function(req, res, next) {
  res.render('user/phoneLog',{layout:null,login:req.session.signErr});
  req.session.signErr=false
});
router.post('/phone-login', function(req, res, next) {
  userHelper.phoneLogin(req.body).then((data)=>{
    if(data.valid===false){
      req.session.phone=req.body.mobile
      res.redirect('/verify')
    }else{
      req.session.signErr=true 
      res.redirect('/phone-login')
    }
  })
});

router.get('/phone-signup', function(req, res, next) {
  if(req.session.userloggedIn){
    res.redirect('/')
  }else{
    res.render('user/phonesignup',{layout:null,login:req.session.err});
    req.session.signErr=false
  }
});
router.post('/phone-signup', function(req, res, next) {
  userHelper.phoneSignup(req.body).then((result)=>{
    console.log(result.status);
    if(result.status){
      req.session.signedIn=true
      req.session.phone=req.body.mobile
      res.redirect('/verify')
    }else{
      req.session.err=true
      console.log("this");
      res.redirect('/phone-signup')
    }
  })
});
router.get('/verify', function(req, res, next) {
  if(req.session.userloggedIn){
    res.redirect('/')
  }else{
    res.render('user/verify',{layout:null,login:req.session.logErr});
    req.session.logErr=false
  }
});
router.post('/verify', function(req, res) {
  userHelper.phoneVerify(req.body,req.session.phone).then((result)=>{
    console.log(result);
    if(result.valid){
      req.session.userloggedIn=true
      req.session.user=result.user
      res.redirect('/')
    }else{
      req.session.logErr=true
      res.redirect('/verify')
    }
  })
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
