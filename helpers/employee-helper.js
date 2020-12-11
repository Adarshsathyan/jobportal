var db=require('../config/connection')
var bcrypt=require('bcrypt')
var collections=require('../config/collections')
var otpAuth=require('../config/otpauth')
const objectId=require("mongodb").ObjectID
const twilio=require('twilio')(otpAuth.accountSId,otpAuth.authToken)
module.exports={

     employeeSignup:(employee)=>{
         return new Promise(async(resolve,reject)=>{
            let user=employee.username
            let empUser=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({username:user})
            let empNum=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({mobile:employee.mobile})
            console.log(empUser,empNum);
            if(empUser){
                resolve(name=false)
            }else if(empNum){
                resolve(name=false)
            }
            else{
                employee.password=await bcrypt.hash(employee.password,10)
                db.get().collection(collections.EMPLOYEE_COLLECTION).insertOne(employee).then((response)=>{
                    
                    resolve(response.ops[0],status=true)
                })
            }
          })
     },
    employeeAuth:(employeeData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let blockResponse={}
            let response={}
            let employee=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({username:employeeData.username})
            block=employee.block
            if(block === "1"){
                console.log("user Blocked");
                blockResponse.status=false
                blockResponse.employee=employee
                
                resolve(blockResponse)
            }else if(employee.password){
                bcrypt.compare(employeeData.password,employee.password).then((status)=>{
                    if(status){
                        response.employee=employee
                        response.status=true
                        resolve(response)
                    }else{
                        resolve({status:false})
                        console.log("login failed");
                    }
                })
            } 
            else{
                resolve({status:false})
                console.log("failed");
            }
        })
    },
    phoneSignup:(phoneDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let p = phoneDetails.mobile
            let puser=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({mobile:p})
            if(puser){
                resolve(status=false)
            }else{
                db.get().collection(collections.EMPLOYEE_COLLECTION).insertOne(phoneDetails).then((response)=>{
                    twilio
                        .verify
                        .services(otpAuth.serviceID)
                        .verifications
                        .create({
                            to:"+91"+phoneDetails.mobile,
                            channel:"sms"
                        }  
                        ).then((data)=>{
                            resolve(data,status=true,response)
                        })
                
                })
            }
            
        })
    },
    phoneAuth:(code,phone)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let pemployee=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({mobile:phone})
            if(pemployee){
                twilio
                    .verify
                    .services(otpAuth.serviceID)
                    .verificationChecks
                    .create({
                        to:"+91"+phone,
                        code:code.otp
                    }).then((data)=>{
                        if(data.valid==true){
                            response.employee=pemployee
                            response.valid=true
                            resolve(response)
                            console.log(response);
                        }else{
                            resolve(data)
                            console.log(data);
                        }
                })
            }else{
                resolve({valid:false})
            }
            
        })
    },
    phoneLogin:(phoneDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let p = phoneDetails.phone
            let puser=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({mobile:p})
            if(puser){
                
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

    addJob:(jobDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOB_COLLECTION).insertOne(jobDetails).then((response)=>{
                resolve(response.ops[0]._id)
            })
        })
    },

    getJobs:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let jobs =await db.get().collection(collections.JOB_COLLECTION).find({eid:id}).toArray()
            console.log(jobs);
            resolve(jobs)
        })
    },

    editJob:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOB_COLLECTION).findOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },
    updateJob:(id,userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOB_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                $set:{
                    name:userDetails.name,
                    location:userDetails.location,
                    designation:userDetails.designation,
                    type:userDetails.type,
                    skills:userDetails.skills,
                    salary:userDetails.salary,
                    description:userDetails.description,
                    experience:userDetails.experience,
                    language:userDetails.language,
                    pin:userDetails.pin,
                    qualification:userDetails.qualification,
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    deleteJob:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOB_COLLECTION).removeOne({_id:objectId(id)}).then((result)=>{
                resolve(result)
            })
        })
    },
}