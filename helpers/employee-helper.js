var db=require('../config/connection')
var bcrypt=require('bcrypt')
var collections=require('../config/collections')
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
    }
}