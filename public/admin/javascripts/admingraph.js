
let adminChart= document.getElementById('adminChart').getContext('2d');
let users=document.getElementById('users').innerText
let employees=document.getElementById('employees').innerText
let jobs=document.getElementById('jobs').innerText
let revenue=document.getElementById('revenue').innerText

 let chart= new Chart(adminChart,{
     type:'bar',
     data:{
         labels:['Users','Employees','Jobs','Total revenue'],
         datasets:[{
             label:"Overall Status",
             data:[
                 users,
                 employees, 
                 jobs,
                 revenue
             ],
             backgroundColor:'#34d8eb'
                 

         }]
     },
     options:{}
})

let empChart= document.getElementById('empChart').getContext('2d');
let application=document.getElementById('applicaton').innerText
let approved=document.getElementById('approved').innerText
let rejected=document.getElementById('rejected').innerText
let category=document.getElementById('category').innerText
let cha= new Chart(empChart,{
    type:'pie',
    data:{
        labels:['Applicatons','Approved','Rejected','Categories'],
        datasets:[{
            label:"Jobs Status",
            data:[
                application,
                approved,
                rejected,
                category
            ],
            backgroundColor:['#34d8eb','#7a123f','#0c1db0','#a11800']
                

        }]
    },
    options:{}
})


