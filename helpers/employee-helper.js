var db=require('../config/connection')
var bcrypt=require('bcrypt')
var collections=require('../config/collections')
var otpAuth=require('../config/otpauth')
const twilio=require('twilio')(otpAuth.accountSId,otpAuth.authToken)
module.exports={

     employeeSignup:(employee)=>{
         return new Promise(async(resolve,reject)=>{
            let user=employee.username
            let empUser=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({username:user})
            if(empUser){
                resolve(status=false)
            }else{
                employee.password=await bcrypt.hash(employee.password,10)
                db.get().collection(collections.EMPLOYEE_COLLECTION).insertOne(employee).then((response)=>{
                    console.log(response)
                    resolve(response.ops[0],status=true)
                })
            }
          })
     },
    employeeAuth:(employeeData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let employee=await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({username:employeeData.username})
            
            if(employee){
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
            }else{
                resolve({status:false})
                console.log("failed");
            }
        })
    },
    phoneSignup:(phoneDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let p = phoneDetails.mobile
            let puser=await db.get().collection(collections.EMP_PHONE_LOGIN).findOne({mobile:p})
            if(puser){
                resolve(status=false)
            }else{
                db.get().collection(collections.EMP_PHONE_LOGIN).insertOne(phoneDetails).then((response)=>{
                    twilio
                        .verify
                        .services(otpAuth.serviceID)
                        .verifications
                        .create({
                            to:phoneDetails.mobile,
                            channel:"sms"
                        }  
                        ).then((data)=>{
                            resolve(data)
                        })
                    resolve(response.ops[0],data,status=true)
                })
            }
            
        })
    },
    phoneAuth:(code,phone)=>{
        return new Promise((resolve,reject)=>{
            twilio
                .verify
                .services(otpAuth.serviceID)
                .verificationChecks
                .create({
                    to:phone,
                    code:code.otp
                }).then((data)=>{
                    resolve(data)
            })
            
        })
    },
    phoneLogin:(phoneDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let p = phoneDetails.phone
            let puser=await db.get().collection(collections.EMP_PHONE_LOGIN).findOne({mobile:p})
            if(puser){
                resolve(status=false)    
            }else{
                twilio
                    .verify
                    .services(otpAuth.serviceID)
                    .verifications
                    .create({
                        to:phoneDetails.phone,
                        channel:"sms"
                    }  
                    ).then((data)=>{
                        resolve(data,status=true)
                })
                
            }
            
        })
    }
}