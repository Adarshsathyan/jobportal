var db = require('../config/connection')
var bcrypt = require('bcrypt')
var collections = require('../config/collections')
var otpAuth = require('../config/otpauth')
const objectId = require("mongodb").ObjectID
const Razorpay = require('razorpay')
const twilio = require('twilio')(otpAuth.accountSId, otpAuth.authToken)
var instance = new Razorpay({
    key_id: 'rzp_test_aXiLerJwygr3M5',
    key_secret: 'HjXinQy80vkLrKQg5VwtjQ3V',
  });

module.exports = {

    employeeSignup: (employee) => {
        return new Promise(async (resolve, reject) => {
            let user = employee.username
            let empUser = await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ username: user })
            let empNum = await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ mobile: employee.mobile })
            console.log(empUser, empNum);
            if (empUser) {
                resolve(name = false)
            } else if (empNum) {
                resolve(name = false)
            }
            else {
                employee.password = await bcrypt.hash(employee.password, 10)
                db.get().collection(collections.EMPLOYEE_COLLECTION).insertOne(employee).then((response) => {

                    resolve(response.ops[0], status = true)
                })
            }
        })
    },
    employeeAuth: (employeeData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let blockResponse = {}
            let response = {}
            let employee = await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ username: employeeData.username })
            block = employee.block
            if (block === "1") {
                console.log("user Blocked");
                blockResponse.status = false
                blockResponse.employee = employee

                resolve(blockResponse)
            } else if (employee.password) {
                bcrypt.compare(employeeData.password, employee.password).then((status) => {
                    if (status) {
                        response.employee = employee
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                        console.log("login failed");
                    }
                })
            }
            else {
                resolve({ status: false })
                console.log("failed");
            }
        })
    },
    phoneSignup: (phoneDetails) => {
        return new Promise(async (resolve, reject) => {
            let p = phoneDetails.mobile
            let puser = await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ mobile: p })
            if (puser) {
                resolve(status = false)
            } else {
                db.get().collection(collections.EMPLOYEE_COLLECTION).insertOne(phoneDetails).then((response) => {
                    twilio
                        .verify
                        .services(otpAuth.serviceID)
                        .verifications
                        .create({
                            to: "+91" + phoneDetails.mobile,
                            channel: "sms"
                        }
                        ).then((data) => {
                            resolve(data, status = true, response)
                        })

                })
            }

        })
    },
    phoneAuth: (code, phone) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let pemployee = await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ mobile: phone })
            if (pemployee) {
                twilio
                    .verify
                    .services(otpAuth.serviceID)
                    .verificationChecks
                    .create({
                        to: "+91" + phone,
                        code: code.otp
                    }).then((data) => {
                        if (data.valid == true) {
                            response.employee = pemployee
                            response.valid = true
                            resolve(response)
                            
                        } else {
                            resolve(data)
                            
                        }
                    })
            } else {
                resolve({ valid: false })
            }

        })
    },
    phoneLogin: (phoneDetails) => {
        return new Promise(async (resolve, reject) => {
            let p = phoneDetails.phone
            let puser = await db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ mobile: p })
            if (puser) {

                twilio
                    .verify
                    .services(otpAuth.serviceID)
                    .verifications
                    .create({
                        to: "+91" + phoneDetails.phone,
                        channel: "sms"
                    }
                    ).then((data) => {
                        resolve(data)
                    })
            } else {
                resolve(status = false)
            }

        })
    },

    addJob: (jobDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.JOB_COLLECTION).insertOne(jobDetails).then((response) => {
                resolve(response.ops[0]._id)
            })
        })
    },

    getJobs: (id) => {
        return new Promise(async (resolve, reject) => {
            let jobs = await db.get().collection(collections.JOB_COLLECTION).find({ eid: id,paid:"1" }).toArray()
            console.log(jobs);
            resolve(jobs)
        })
    },

    editJob: (id) => {
        return new Promise((resolve, reject) => {
            result={}
            db.get().collection(collections.JOB_COLLECTION).findOne({ _id: objectId(id) }).then((result) => {
                result.job=result
                
                db.get().collection(collections.CATEGORY_COLLECTION).find().toArray().then((response=>{
                    result.categories=response
                    resolve(result)
                    
                }))
                
            })
        }) 
    },
    updateJob: (id, userDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.JOB_COLLECTION).findOneAndUpdate({ _id: objectId(id) }, {
                $set: {
                    name: userDetails.name,
                    location: userDetails.location,
                    designation: userDetails.designation,
                    type: userDetails.type,
                    skills: userDetails.skills,
                    salary: userDetails.salary,
                    description: userDetails.description,
                    experience: userDetails.experience,
                    language: userDetails.language,
                    pin: userDetails.pin,
                    qualification: userDetails.qualification,
                    category:userDetails.category
                }
            }).then(() => {
                resolve()
            })
        })
    },
    deleteJob: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.JOB_COLLECTION).removeOne({ _id: objectId(id) }).then((result) => {
                resolve(result)
            })
        })
    },
    getProfile: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ _id: objectId(id) }).then((result) => {
                resolve(result)
            })
        })
    },
    editEmployee: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ _id: objectId(id) }).then((result) => {
                resolve(result)
            })
        })
    },
    updateEmployee: (id, empdetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.EMPLOYEE_COLLECTION).findOneAndUpdate({ _id: objectId(id) }, {
                $set: {
                    name: empdetails.name,
                    username: empdetails.username,
                    mobile: empdetails.mobile,
                    website: empdetails.website,
                    address: empdetails.address
                }
            }).then(() => {
                db.get().collection(collections.EMPLOYEE_COLLECTION).findOne({ _id: objectId(id) }).then((result) => {
                    resolve(result)
                })

            })
        })
    },
    requests: (eid) => {
        return new Promise((resolve, reject) => {
            reqDetails = {}
            db.get().collection(collections.APPLICATION_COLLECTION).find({ eid: eid,approve:"0" }).toArray().then((requests) => {
                resolve(requests)
            })

        })
    },
    viewResume:(id)=>{
        return new Promise((resolve,reject)=>{
           let response={}
            db.get().collection(collections.APPLICATION_COLLECTION).findOne({_id:objectId(id)}).then((application)=>{
                response.application=application
                db.get().collection(collections.USER_COLLECTION).findOne({_id:objectId(application.uid)}).then((result)=>{
                    response.user=result
                    resolve(response)
                })
            })
        })
    },
    approve:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.APPLICATION_COLLECTION).updateOne({_id:objectId(id)},{$set:{
                approve:"1"
            }}).then((response)=>{
                resolve()
            })
        })
    },
    approvedReq:(eid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.APPLICATION_COLLECTION).find({ eid: eid,approve:"1" }).toArray().then((requests) => {
                resolve(requests)
            })
        })
    },
    reject:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.APPLICATION_COLLECTION).updateOne({_id:objectId(id)},{$set:{approve:"2"}}).then((response)=>{
                resolve()
            })
        })
    },
    viewUser:(uid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).findOne({_id:objectId(uid)}).then((user)=>{
                resolve(user)
            })
        })
    },
    getAllDetails:(eId)=>{
        return new Promise(async(resolve,reject)=>{
            let details={}
           let jobs= await db.get().collection(collections.JOB_COLLECTION).find({eid:eId}).toArray()
            details.jobs=jobs.length
            let requests= await db.get().collection(collections.APPLICATION_COLLECTION).find({eid:eId,approve:"0"}).toArray() 
            details.requests=requests.length
            let approved= await db.get().collection(collections.APPLICATION_COLLECTION).find({approve:"1"}).toArray()
            details.approved=approved.length
            let rejected= await db.get().collection(collections.APPLICATION_COLLECTION).find({approve:"2"}).toArray()
            details.rejected=rejected.length
            resolve(details)
        })
    },
    generateRazorpay:(orderId)=>{
        return new Promise((resolve,reject)=>{
            var options = {
                amount: 100000,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ""+orderId
              };
              instance.orders.create(options, function(err, order) {
                db.get().collection(collections.PAYMENT_COLLECTION).insertOne(order).then(()=>{
                    resolve(order)
                })
                
              });
        })
    },
    verifyPayment:(details)=>{
        return new Promise((resolve,reject)=>{
            
            const crypto =require('crypto')
            let hmac= crypto.createHmac('sha256','HjXinQy80vkLrKQg5VwtjQ3V') 
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
            hmac=hmac.digest("hex")
            
            if(hmac===details['payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }
        })
    },
    changePaymentStatus:(jobId)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collections.JOB_COLLECTION).updateOne({_id:objectId(jobId)},{$set:{
                paid:"1"
            }}).then((response)=>{
                resolve()
            })
        })
    },
    viewJobDetails:(jobId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOB_COLLECTION).findOne({_id:objectId(jobId)}).then((result)=>{
               
                resolve(result)
            })
        })
    },
    viewApprovedList:(jobId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.APPLICATION_COLLECTION).find({jid:jobId}).toArray().then((result)=>{
                resolve(result)
            })
        })
    },
    getCategory:()=>{{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CATEGORY_COLLECTION).find().toArray().then((result)=>{
                resolve(result)
            })
        })
    }}
}