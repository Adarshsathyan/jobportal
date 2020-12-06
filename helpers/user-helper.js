var db=require('../config/connection')
var bcrypt=require('bcrypt')
var collections=require('../config/collections')
var otpAuth=require('../config/otpauth')
const twilio=require('twilio')(otpAuth.accountSId,otpAuth.authToken)

module.exports={
    userSignup:(userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let nUser=userDetails.username
            let user=await db.get().collection(collections.USER_COLLECTION).findOne({username:nUser})
            if(user){
                resolve(name=false)
            }else{
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
            let response={}
            let user=await db.get().collection(collections.USER_COLLECTION).findOne({username:userData.username})
            console.log(user);
            if(user){
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
            let p = details.mobile
            let puser=await db.get().collection(collections.USER_COLLECTION).findOne({mobile:p})
            
            if(puser){
                resolve(status=false)
            }else{
                db.get().collection(collections.USER_COLLECTION).insertOne(details).then((response)=>{
                    twilio
                        .verify
                        .services(otpAuth.serviceID)
                        .verifications
                        .create({
                            to:"+91"+details.mobile,
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
            let p = phoneDetails.mobile
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
                        to:"+91"+phoneDetails.mobile,
                        channel:"sms"
                    }  
                    ).then((data)=>{ 
                        resolve(data)
                })
            }else{
                resolve(status=false)
            }
            
        })
    }
}