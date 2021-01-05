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
      req.session.jobs=result
    
      res.render('employee/jobs',{employee:true,employeeUser:req.session.employe,jobs:result});
    })
  }else{
    res.redirect('/employee')
  }
  
});

router.get('/requests', function(req, res) {
  if(req.session.emploggedIn){
  
    employeeHelper.requests(req.session.employe._id).then((request)=>{
      jobs=req.session.jobs
      res.render('employee/requests',{employee:true,employeeUser:req.session.employe,request});
    })
    
  }else{
    res.redirect('/employee')
  }
  
});
router.get('/approved', function(req, res) {
  if(req.session.emploggedIn){
    employeeHelper.approvedReq(req.session.employe._id).then((approved)=>{
      res.render('employee/approved',{employee:true,employeeUser:req.session.employe,approved});
    })
    
  }else{
    res.redirect('/employee')
  }
  
});
router.get('/addjob', function(req, res) {
  if(req.session.emploggedIn){
    employeeHelper.getCategory().then((category)=>{
      res.render('employee/add-job',{employee:true,employeeUser:req.session.employe,category});
    })
    

  }else{
    res.redirect('/employee')
  }
  
});

router.post('/addjob', function(req, res) {
  employeeHelper.addJob(req.body).then((id)=>{
    if(req.files){
      let image=req.files.image
      let logo=req.files.logo
      logo.mv('./public/employee/job-logo/'+id+'.jpg')
    image.mv('./public/employee/job_images/'+id+'.jpg',(err,done)=>{
      if(!err){
        req.session.jobId=id
        res.redirect('/employee/showpayment')
      }else{
        res.redirect('/employee/addjob')
      }
    })
    }
  })
  
});

router.get('/showpayment', function(req, res) {
  if(req.session.emploggedIn){
    res.render('employee/payment',{employee:true,employeeUser:req.session.employe,jobId:req.session.jobId});

    
  }else{
    res.redirect('/employee')
  }
  
});
router.get('/razorpay/:id', function(req, res) {
  if(req.session.emploggedIn){
   employeeHelper.generateRazorpay(req.params.id).then((response)=>{
    res.json(response)
  
   })
  }else{
    res.redirect('/employee')
  }
  
});


router.get('/home', function(req, res) {
  if(req.session.emploggedIn){
   employeeHelper.getAllDetails(req.session.employe._id).then((details)=>{
    res.render('employee/index',{employee:true,employeeUser:req.session.employe,jobs:details.jobs,approved:details.approved,
      requests:details.requests,rejected:details.rejected});
   })
    
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
    ;
      res.render('employee/edit-job',{employee:true,job:response.job,categories:response.categories,employeeUser:req.session.employe})
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

router.get('/profile',function(req,res){
  if(req.session.emploggedIn){
    
      res.render('employee/profile',{employee:true,employeeUser:req.session.employe})
  }else{
    res.redirect('/employee')
  }
 
})
router.get('/editprofile/:id',function(req,res){
  if(req.session.emploggedIn){
    employeeHelper.editEmployee(req.params.id).then((employee)=>{
      res.render('employee/profile-edit',{employee:true,employeeUser:req.session.employe,employee})
    })
    
  }else{
    res.redirect('/employee')
  }
  
})

router.post('/editprofile/:id',function(req,res){
    employeeHelper.updateEmployee(req.params.id,req.body).then((employee)=>{
      req.session.employe=null
      req.session.employe=employee
     res.redirect('/employee/profile')
    }) 
})
router.get('/viewresume/:id',function(req,res){
  if(req.session.emploggedIn){ 
    employeeHelper.viewResume(req.params.id).then((application)=>{
      res.render('employee/view-resume',{employee:true,employeeUser:req.session.employe,applicat:application.application,userdetail:application.user})
    })
    
  }else{
    res.redirect('/employee')
  }
})
router.get('/approve/:id',function(req,res){
  if(req.session.emploggedIn){
    employeeHelper.approve(req.params.id).then((application)=>{
      res.redirect('/employee/requests')
    })
    
  }else{
    res.redirect('/employee')
  }
})
router.get('/reject/:id',function(req,res){
  if(req.session.emploggedIn){
    employeeHelper.reject(req.params.id).then(()=>{
      res.redirect('/employee/requests')
    })
    
  }else{
    res.redirect('/employee')
  }
})
router.get('/userprofile/:id',function(req,res){
  if(req.session.emploggedIn){
    employeeHelper.viewUser(req.params.id).then((user)=>{
      req.session.noEdit=true
      res.render('user/profile',{layout:'./layoutuser',user,noedit:true})
    })
    
  }else{
    res.redirect('/employee')
  }
})

router.post('/verify-payment',function(req,res){
  console.log(req.body);
  employeeHelper.verifyPayment(req.body).then(()=>{
    
    employeeHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      res.json({status:true})
    })
  }).catch((err)=>{
    res.json({status:false})
  })
  
})

router.get('/viewjob/:id',function(req,res){
  if(req.session.emploggedIn){
    employeeHelper.viewJobDetails(req.params.id).then((result)=>{
     employeeHelper.viewApprovedList(req.params.id).then((applied)=>{
  
      res.render('employee/jobdetails',{employee:true,employeeUser:req.session.employe,result,applied})
     }) 
     
    })
     
  }else{
    res.redirect('/employee')
  }
 
})

module.exports = router;
