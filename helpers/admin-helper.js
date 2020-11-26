var db=require('../config/connection')
var bcrypt=require('bcrypt')
var collections=require('../config/collections')
module.exports={

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
    
    
    // }
    adminAuth:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
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
    }
}