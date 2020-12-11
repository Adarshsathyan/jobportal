var express = require('express');
var router = express.Router();
var employeeHelper=require('../helpers/employee-helper')

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.emploggedIn){
    res.redirect('/employee/home')
  }else{
    res.render('employee/login',{layout:null,login:req.session.signErr,block:req.session.blockErr});
    req.session.blockErr=false
    req.session.signErr=false
  }
  
});
router.post('/', function(req, res) {
  employeeHelper.employeeAuth(req.body).then((response)=>{
    if(response.status){
      req.session.emploggedIn=true
      req.session.employe=response.employee
      res.redirect('/employee/home')
    }else if(response.employee){
      req.session.blockErr=true
      res.redirect('/employee')
    }else{
      req.session.signErr=true
      res.redirect('/employee')
    }
    
  })


});

router.get('/signup', function(req, res) {
  if(req.session.emploggedIn){
    res.redirect('/employee/home')
  }else{
    res.render('employee/signup',{layout:null,login:req.session.signErr});
    req.session.signErr=false
  }
  
});

router.post('/signup', function(req, res) {
  employeeHelper.employeeSignup(req.body).then((response)=>{
    console.log(response);
    if(response.name){
      req.session.emploggedIn=true
    req.session.employe=response
    res.redirect('/employee/home')
    }else{
      req.session.signErr=true
      res.redirect('/employee/signup')
    }
    
  })
  
});
router.get('/logout',function(req,res){
  req.session.emploggedIn=null
  res.redirect('/employee')
})

router.get('/jobs', function(req, res) {
  if(req.session.emploggedIn){
    employeeHelper.getJobs(req.session.employe._id).then((result)=>{
      res.render('employee/jobs',{employee:true,employeeUser:req.session.employe,jobs:result});
    })
  }else{
    res.redirect('/employee')
  }
  
});

router.get('/requests', function(req, res) {
  if(req.session.emploggedIn){
    res.render('employee/requests',{employee:true,employeeUser:req.session.employe});
  }else{
    res.redirect('/employee')
  }
  
});
router.get('/approved', function(req, res) {
  if(req.session.emploggedIn){
    res.render('employee/approved',{employee:true,employeeUser:req.session.employe});
  }else{
    res.redirect('/employee')
  }
  
});
router.get('/addjob', function(req, res) {
  if(req.session.emploggedIn){
    res.render('employee/add-job',{employee:true,employeeUser:req.session.employe});

  }else{
    res.redirect('/employee')
  }
  
});

router.post('/addjob', function(req, res) {
  employeeHelper.addJob(req.body).then((id)=>{
    let image=req.files.image
    image.mv('./public/employee/job_images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/employee/jobs')
      }else{
        res.redirect('/employee/addjob')
      }
    })
    
  })
  
});

router.get('/home', function(req, res) {
  if(req.session.emploggedIn){
    console.log(req.session.employe);
    res.render('employee/index',{employee:true,employeeUser:req.session.employe});
  }else{
    res.redirect('/employee')
  }
  
});

router.get('/phone', function(req, res) {
  res.render('employee/phone_login',{layout:null,login:req.session.signErr});
  req.session.signErr=false
});
router.post('/phone', function(req, res) {
  
  employeeHelper.phoneLogin(req.body).then((data)=>{
    if(data.valid===false){
      
      req.session.phone=req.body.phone
      res.redirect('/employee/verify')
    }else{
      req.session.signErr=true 
      res.redirect('/employee/phone')
    }
  })
});
router.get('/verify', function(req, res) {
  if(req.session.emploggedIn){
    res.redirect('/employee/home')
  }else{
    res.render('employee/verify_phone',{layout:null,login:req.session.logErr});
    req.session.logErr=false
  }
  
});

router.post('/verify', function(req, res) {
  employeeHelper.phoneAuth(req.body,req.session.phone).then((result)=>{
    
    if(result.valid){
    req.session.employe=result.employee
    req.session.emploggedIn=true
    res.redirect('/employee/home')
  }else{
    req.session.logErr=true
    res.redirect('/employee/verify')
  }
    
  })
});

router.get('/phone-signup', function(req, res) {
  if(req.session.signedIn){
    res.redirect('/employee/verify')
  }
  res.render('employee/phone-reg',{layout:null,log:req.session.err});
  req.session.err=false
});

router.post('/phone-signup', function(req, res) {
  employeeHelper.phoneSignup(req.body).then((result)=>{
    console.log(result);
    if(result.status){
      req.session.signedIn=true
      req.session.phone=req.body.mobile
      res.redirect('/employee/verify')
    }else{
      req.session.err=true
      res.redirect('/employee/phone-signup')
    }
   
  })
});
router.get('/editjob/:id', function(req, res){
  if(req.session.emploggedIn){
    employeeHelper.editJob(req.params.id).then((response)=>{
      res.render('employee/edit-job',{employee:true,job:response,employeeUser:req.session.employe})
    })
  }else{
    res.redirect('/employee')
  }
});
router.post('/editjob/:id',function(req,res){
  employeeHelper.updateJob(req.params.id,req.body).then(()=>{
    res.redirect('/employee/jobs')
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/employee/job_images/'+req.params.id+'.jpg')
    }
  })
});
router.get('/deletejob/:id',function(req,res){
  employeeHelper.deleteJob(req.params.id).then(()=>{
    res.redirect('/employee/jobs')
  })
});


module.exports = router;
