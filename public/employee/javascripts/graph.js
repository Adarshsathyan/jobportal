 let jobChart=document.getElementById('jobChart').getContext('2d')
let myChart= document.getElementById('myChart').getContext('2d');
let request=document.getElementById('requests').innerText
let jobs=document.getElementById('jobs').innerText
let approved=document.getElementById('approved').innerText

console.log(request);
 let chart= new Chart(myChart,{
     type:'bar',
     data:{
         labels:['Requests','Approve','Jobs'], 
         datasets:[{
             label:"Overall Status",
             data:[
                 request,
                jobs,
                 approved
             ],
             backgroundColor:'#f7754d'
                 

         }]
     },
     options:{}
})
let rejected=document.getElementById('rejected').innerText
let ch= new Chart(jobChart,{
    type:'pie',
    data:{
        labels:['Jobs','Applied users','Approved','rejected'], 
        datasets:[{
            label:"Overall Status",
            data:[
                jobs,
                request,
                approved,
                rejected
                
            ],
            backgroundColor:["#eb4034","#03ab22","#0652c4","#7a123f"]
                

        }]
    },
    options:{}
})





