var express = require('express');
var router = express.Router();
var userHelper=require('../helpers/user-helper')
var url=require('url')

/* GET home page. */
router.get('/', function(req, res, next) { 
  userHelper.getCategoryAndJobs().then((response)=>{
  if(req.session.userloggedIn){
    userHelper.getNotified(req.session.user._id).then((applications)=>{
      req.session.applications=applications
      res.render('user/index',{layout:'./layoutuser',user:req.session.user,applied:applications,
      apply:req.session.status,categories:response.categories,jobs:response.jobs,searchop:req.session.searchoutput});
      req.session.searchoutput=null
    })
  }else{
    res.render('user/index',{layout:'./layoutuser',categories:response.categories,jobs:response.jobs,searchop:req.session.searchoutput});
    req.session.searchoutput=null
  }
})
});

router.get('/jobs', function(req, res, next) {
  userHelper.getAllJobs().then((jobs)=>{
    res.render('user/jobs',{layout:'./layoutuser',jobs:jobs,user:req.session.user
    ,approve:req.session.approve,reject:req.session.reject,applied:req.session.applications});
  })
  
});
router.get('/jobdetails/:id', function(req, res, next) {
  userHelper.getJobDetails(req.params.id).then((jobdetail)=>{
    res.render('user/job-detail',{layout:'./layoutuser',job:jobdetail,user:req.session.user 
    ,approve:req.session.approve,reject:req.session.reject,applied:req.session.applications});
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
router.post('/signup', function(req, res) {
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
      req.session.phone=req.body.phone
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
      req.session.phone=req.body.phone
      res.redirect('/verify')
    }else{
      req.session.err=true
      res.redirect('/phone-signup')
    }
  })
});
router.get('/verify', function(req, res, next) {
  if(req.session.userloggedIn){
    res.redirect('/')
  }else{
    res.render('user/verify',{layout:null,login:req.session.logErr,user:req.session.user});
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
  res.render('user/about',{layout:'./layoutuser',user:req.session.user,approve:req.session.approve,
  reject:req.session.reject,applied:req.session.applications});
});

router.get('/jobdetails', function(req, res, next) {
  res.render('user/job-details',{layout:'./layoutuser',user:req.session.user,approve:req.session.approve,
  reject:req.session.reject,applied:req.session.applications});
});

router.get('/contact', function(req, res, next) {
  res.render('user/contact',{layout:'./layoutuser',user:req.session.user,approve:req.session.approve,
  reject:req.session.reject,
  contacted:req.session.contacted,applied:req.session.applications});
  req.session.contacted=false
});

router.post('/contact', function(req, res, next) {
  if(req.session.userloggedIn){
    userHelper.contact(req.body).then(()=>{
      req.session.contacted=true
      res.redirect('/contact')
    })
  }else{
    res.redirect('/login')
  }
  
});


router.get('/apply/:id', function(req, res) {
  if(req.session.userloggedIn){
    userHelper.apply(req.params.id).then((result)=>{
        res.render('user/apply',{layout:'./layoutuser',job:result,user:req.session.user
        ,approve:req.session.approve,reject:req.session.reject,apply:req.session.applied,applied:req.session.applications});
        req.session.applied=false
    })
  }else{
    res.redirect('/login')
  }
  
  
});

router.post('/apply/', function(req, res) {
  userHelper.applyJob(req.body).then((result)=>{
    if(result.status){
      req.session.applied=true
      res.redirect('/apply'+req.body.jid)
    }else{
      res.redirect('/')
    }
  })
});

router.get('/profile', function(req, res, next) {
  if(req.session.userloggedIn){
    userHelper.getAppliedJobs(req.session.user._id).then((appliedjobs)=>{
      res.render('user/profile',{layout:'./layoutuser',user:req.session.user,appliedjobs
      ,approve:req.session.approve,reject:req.session.reject,applied:req.session.applications});
    })
    
  }else{
    res.redirect('/login')
  }
  
});
router.get('/editprofile/', function(req, res, next) {
  if(req.session.userloggedIn){
    res.render('user/edit-profile',{layout:'./layoutuser',user:req.session.user,approve:req.session.approve,reject:req.session.reject
    ,applied:req.session.applications});
  }else{
    res.redirect('/login')
  }
  
});
router.post('/updateprofile/:id', function(req, res, next) {
  userHelper.updateUser(req.params.id,req.body).then((result)=>{
    req.session.user=result
    if(req.files){
      let image=req.files.image
      image.mv('./public/user/userimages/'+req.params.id+'.jpg')
    }if(req.files){
      let resume=req.files.resume
      resume.mv('./public/user/user-resumes/'+req.params.id+'.pdf')
    }
    res.redirect('/profile')
  })
});

router.get('/checkStatus/:id',function(req,res){
  userHelper.status(req.params.id).then((job)=>{
    if(job.approve==0){
      res.json({pending:true})
    }else if(job.approve==1){
      res.json({confirm:true})
    }else{
      res.json({reject:true})
    }
  })
})

router.get('/cancelrequest/:id',function(req,res){
  userHelper.cancelRequest(req.params.id).then(()=>{
    res.json({status:true})
  }) 
})

router.get('/searchjob',function(req,res){
  var q=url.parse(req.url,true)
  userHelper.getSearchedJobs(q.query).then((response)=>{
    req.session.searchoutput=response
    res.redirect('/')
  })
   
})



module.exports = router;
