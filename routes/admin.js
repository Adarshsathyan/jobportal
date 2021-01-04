var express = require('express');
var router = express.Router();
var adminHelper=require('../helpers/admin-helper')

const verifyLog=(req,res,next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin')
  }
}

//login page
router.get('/',function(req,res){
  if(req.session.adminLoggedIn){
      res.redirect('/admin/home')
  }else{
    res.render('admin/login',{layout:null,"Login":req.session.adminErr})
    req.session.adminErr=false
  }  
});

//checking is admin is authenticated
router.post('/',function(req,res){
  //code to edit or signup admin
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

//admin home page
router.get('/home', function(req, res){
  let admin=req.session.admin
  if(admin){
    adminHelper.getAllDetails().then((details)=>{
      res.render('admin/index',{admin:true,jobs:details.jobs,users:details.users,
        employees:details.employee,jobs:details.jobs,revenue:details.revenue,application:details.application,approved:details.approved
        ,rejected:details.rejected,category:details.category})
    })
    
  }else{
    res.redirect('/admin')
  }
});

//logout
router.get('/logout', function(req, res){
  req.session.adminLoggedIn=null
  res.redirect('/admin')
});

//get all users logged
router.get('/users', function(req, res){
  if(req.session.adminLoggedIn){
    adminHelper.getUsers().then((response)=>{
      res.render('admin/users',{admin:true,users:response})
    })
    
  }else{
    res.redirect('/admin')
  }
});

//get all blocked employees
router.get('/blocked_employees', function(req, res){
  if(req.session.adminLoggedIn){
    adminHelper.getBlockedEmployees().then((data)=>{
      res.render('admin/blocked_employees',{admin:true,employees:data})
    }) 
  }else{
    res.redirect('/admin')
  }
});

//get all employees logged
router.get('/employee', function(req, res){
  if(req.session.adminLoggedIn){
    adminHelper.getAllEmployee().then((data)=>{
      res.render('admin/employee',{admin:true,employees:data})
    })
  }else{
    res.redirect('/admin')
  }
});

//block employee
router.get('/block/:id', function(req, res){
  adminHelper.block(req.params.id).then((response)=>{
    res.redirect('/admin/employee')
  }) 
});

//unblock employee
router.get('/unblock/:id', function(req, res){
  adminHelper.unBlock(req.params.id).then((response)=>{
    res.redirect('/admin/blocked_employees')
  }) 
});

//edit employee
router.get('/edit/:id', function(req, res){
  if(req.session.adminLoggedIn){
    adminHelper.edit(req.params.id).then((response)=>{
      res.render('admin/employee-form',{admin:true,employer:response})
    })
  }else{
    res.redirect('/admin')
  }
});

//update edited employee
router.post('/edit/:id',function(req,res){
  adminHelper.updateEmployee(req.params.id,req.body).then(()=>{
    res.redirect('/admin/employee')
  })
});

//Delete Employee
router.get('/delete/:id',function(req,res){
  adminHelper.delete(req.params.id).then(()=>{
    res.redirect('/admin/employee')
  })
});

//Delete users
router.get('/deleteuser/:id',function(req,res){
  adminHelper.deleteUser(req.params.id).then(()=>{
    res.redirect('/admin/users')
  })
});

//block user
router.get('/blockuser/:id', function(req, res){
  adminHelper.blockUser(req.params.id).then((response)=>{
    res.redirect('/admin/users')
  }) 
});

//get all blocked employees
router.get('/blockedusers', function(req, res){
  if(req.session.adminLoggedIn){
    adminHelper.getBlockedUsers().then((data)=>{
      res.render('admin/blocked_users',{admin:true,users:data})
    }) 
  }else{
    res.redirect('/admin')
  }
});

//unblock user
router.get('/unblockuser/:id', function(req, res){
  adminHelper.unBlockUser(req.params.id).then((response)=>{
    res.redirect('/admin/blockedusers')
  }) 
});
router.get('/viewemployee/:id', function(req, res){
  adminHelper.viewEmployee(req.params.id).then((response)=>{
    req.session.onlyview=true
    res.render('employee/profile',{employee:true,employeeUser:response,view:req.session.onlyview})
  }) 
});
router.get('/viewuser/:id', function(req, res){
  adminHelper.viewUser(req.params.id).then((user)=>{
    req.session.noEdit=true
      res.render('user/profile',{layout:'./layoutuser',user,noedit:true})
  }) 
});

router.get('/category', verifyLog ,function(req, res){
  adminHelper.categoryList().then((categories)=>{
      res.render('admin/category',{admin:true,categories})
    })
  });

router.get('/addcategory', verifyLog ,function(req, res){
  
    res.render('admin/add-category',{admin:true})
  
   
});
router.post('/addcategory', verifyLog ,function(req, res){
  adminHelper.addCategory(req.body).then(()=>{
    res.redirect('/admin/category')
  })
});
router.get('/feedback', function(req, res){
  adminHelper.getFeedback().then((messages)=>{
      res.render('admin/feedbacks',{admin:true,messages})
  }) 
});


module.exports = router;
 