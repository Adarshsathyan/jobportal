var express = require('express');
var router = express.Router();
var adminHelper=require('../helpers/admin-helper')

/* GET users listing. */
router.get('/',function(req,res){
  if(req.session.adminLoggedIn){
      res.redirect('/admin/home')
  }else{
    res.render('admin/login',{layout:null,"Login":req.session.adminErr})
    req.session.adminErr=false
  }
  
});



router.post('/',function(req,res){
  
  // adminhelper.adminSignup(req.body).then((result)=>{
  //   console.log(result);
  // })


  adminHelper.adminAuth(req.body).then((response)=>{
    if(response.status){
      req.session.adminLoggedIn=true
      req.session.admin=response.admin 
      res.redirect('/admin/home')
    }else{
      req.session.adminErr=true
      res.redirect('/admin')
    }
  })
});

router.get('/home', function(req, res){
  let admin=req.session.admin
  if(admin){
    res.render('admin/index',{admin:true})
  }else{
    res.redirect('/admin')
  }
});


router.get('/logout', function(req, res){
  req.session.destroy()
  res.redirect('/admin')
});


router.get('/users', function(req, res){
  res.render('admin/users',{admin:true})
});


router.get('/employee', function(req, res){
  res.render('admin/employee',{admin:true})
});


module.exports = router;
