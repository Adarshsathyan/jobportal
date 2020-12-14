var db=require('../config/connection')
var bcrypt=require('bcrypt')
var collections=require('../config/collections')
var otpAuth=require('../config/otpauth')
const objectId=require("mongodb").ObjectID
const twilio=require('twilio')(otpAuth.accountSId,otpAuth.authToken)

module.exports={
    userSignup:(userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let nUser=userDetails.username
            let user=await db.get().collection(collections.USER_COLLECTION).findOne({username:nUser})
            let userNum=await db.get().collection(collections.USER_COLLECTION).findOne({phone:userDetails.phone})
            if(user){
                resolve(name=false)
            }else if(userNum){
                resolve(name=false)
            }
            else{
                userDetails.password=await bcrypt.hash(userDetails.password,10)
                db.get().collection(collections.USER_COLLECTION).insertOne(userDetails).then((response)=>{
                    console.log(response)
                    resolve(response.ops[0],status=true)
                })
            }
          })
    },
    userLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let blockResponse={}
            let response={}
            let user=await db.get().collection(collections.USER_COLLECTION).findOne({username:userData.username})
            block=user.block
            if(block === "1"){
                console.log("user Blocked");
                blockResponse.status=false
                blockResponse.user=user
                resolve(blockResponse)
            }else if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        response.user=user
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
    phoneSignup:(details)=>{
        return new Promise(async(resolve,reject)=>{
            let p = details.phone
            let puser=await db.get().collection(collections.USER_COLLECTION).findOne({phone:p})
            console.log(puser);
            if(puser){
                resolve(status=false)
            }else{
                db.get().collection(collections.USER_COLLECTION).insertOne(details).then((response)=>{
                    twilio
                        .verify
                        .services(otpAuth.serviceID)
                        .verifications
                        .create({
                            to:"+91"+details.phone,
                            channel:"sms"
                        }  
                        ).then((data)=>{
                            resolve(data,status=true,response)
                        })
                
                })
            }
            
        })
    },
    phoneVerify:(code,mobilenum)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let puser=await db.get().collection(collections.USER_COLLECTION).findOne({phone:mobilenum})
            response.user=puser
            response.valid=true
            console.log(puser);
            twilio
                .verify
                .services(otpAuth.serviceID)
                .verificationChecks
                .create({
                    to:"+91"+mobilenum,
                    code:code.otp
                }).then((data)=>{
                    if(data.valid==true){
                        resolve(response)
                    }else{
                        resolve(data)
                    }
                    
            })
            
        })
    },
    phoneLogin:(phoneDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let p = phoneDetails.phone
            let puser=await db.get().collection(collections.USER_COLLECTION).findOne({phone:p})
            console.log(p);
            console.log(puser);
            if(puser){
                console.log("entered");
                twilio
                    .verify
                    .services(otpAuth.serviceID)
                    .verifications
                    .create({
                        to:"+91"+phoneDetails.phone,
                        channel:"sms"
                    }  
                    ).then((data)=>{ 
                        resolve(data)
                })
            }else{
                resolve(status=false)
            }
            
        })
    },
    getAllJobs:()=>{
        return new Promise(async(resolve,reject)=>{
            let jobs =await db.get().collection(collections.JOB_COLLECTION).find().toArray()
            resolve(jobs)
        })
    },

    getJobDetails:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let result={}
            let job= await db.get().collection(collections.JOB_COLLECTION).findOne({_id:objectId(id)})
            let employee = await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({_id:objectId(job.eid)})
            result.jobdetails=job
            result.employee=employee
            resolve(result)
  
        })
    },
    apply:(id)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.JOB_COLLECTION).findOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },
    applyJob:(application)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.APPLICATION_COLLECTION).insertOne(application).then((result)=>{
                resolve(result.ops[0]._id)
            })
        })
    }
}