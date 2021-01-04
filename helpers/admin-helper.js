var db=require('../config/connection')
var bcrypt=require('bcrypt')
var collections=require('../config/collections')
const e = require('express')
const objectId=require("mongodb").ObjectID
module.exports={
    //signup or for changing admin password for future use
    // adminSignup:(admin)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         admin.password=await bcrypt.hash(admin.password,10)
    //         db.get().collection(collections.ADMIN_COLLECTION).insertOne(admin).then((response)=>{
    //             resolve(response.ops[0])
    //         })
    //      })
        
        
    //     // db.get().collection(collections.ADMIN_COLLECTION).find().toArray().then((data)=>{
    //     //     callback(data)
    //     // })
    
    
    // },

    //admin authentication
    adminAuth:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            //let loginStatus=false
            let response={}
            let admin=await db.get().collection(collections.ADMIN_COLLECTION).findOne({username:adminData.username}) 
            if(admin){
                bcrypt.compare(adminData.password,admin.password).then((status)=>{
                    if(status){
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    }else{
                        resolve({status:false})
                        console.log("login failed");
                    }
                })
            }else{
                resolve({status:false})
                console.log("failed");
            }
        })
    },

    //get all employees
    getAllEmployee:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).find({block:"0"}).toArray().then((result)=>{
                resolve(result)
            })  
        })
    },
   
    //block employee
    block:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                $set:{block:"1"}
            }).then((result)=>{
                resolve(result)
            })
        })
    },

    //unblock employee
    unBlock:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                $set:{block:"0"}
            }).then((result)=>{
                resolve(result)
            })
        })
    },

    //to get all blocked employees
    getBlockedEmployees:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).find({block:"1"}).toArray().then((result)=>{
                resolve(result)
            })
        })
    },

    //edit employee
    edit:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },

    //update edited employee
    updateEmployee:(id,empDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                $set:{
                    name:empDetails.name,
                    username:empDetails.username,
                    mobile:empDetails.mobile
                }
            }).then((response)=>{
                resolve()
            })
        })
    },

    //delete employee
    delete:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).removeOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },

    //users list
    getUsers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).find({block:"0"}).toArray().then((result)=>{
                resolve(result)
            })  
        })
    },

    //delete user
    deleteUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).removeOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },

    //block user
    blockUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                $set:{block:"1"}
            }).then((result)=>{
                resolve(result)
            })
        })
    },

    //to get all blocked users
    getBlockedUsers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).find({block:"1"}).toArray().then((result)=>{
                resolve(result)
            })
        })
    },
    //to ublock users
    unBlockUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                $set:{block:"0"}
            }).then((result)=>{
                resolve(result)
            })
        })
    },
    getAllDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let details={}
         let employee= await  db.get().collection(collections.EMPLOYEE_COLLECTION).find().toArray()
         details.employee=employee.length
         let users=await db.get().collection(collections.USER_COLLECTION).find().toArray()
         details.users=users.length
         let blockedusers=await db.get().collection(collections.JOB_COLLECTION).find().toArray()
         details.jobs=blockedusers.length
         let revenue=await db.get().collection(collections.PAYMENT_COLLECTION).find().toArray()
         rev=0
         revenue.forEach(element => {
             rev=rev+1000
         });
         let reve=rev
         details.revenue=reve
         let application=await db.get().collection(collections.APPLICATION_COLLECTION).find().toArray()
         details.application=application.length
         let approved=await db.get().collection(collections.APPLICATION_COLLECTION).find({approve:"1"}).toArray()
         details.approved=approved.length
         let rejected=await db.get().collection(collections.APPLICATION_COLLECTION).find({approve:"2"}).toArray()
         details.rejected=rejected.length
         let category=await db.get().collection(collections.CATEGORY_COLLECTION).find().toArray()
         details.category=category.length
         resolve(details)
        })
    },
    viewEmployee:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },
    viewUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).findOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },
    addCategory:(category)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CATEGORY_COLLECTION).insertOne(category).then(()=>{
                resolve()
            })
        })
    },
    categoryList:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CATEGORY_COLLECTION).find().toArray().then((result)=>{
                resolve(result)
            })
        })
    },
    getFeedback:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CONTACT_COLLECTION).find().toArray().then((result)=>{
                resolve(result)
            })
        })  
    }
} 