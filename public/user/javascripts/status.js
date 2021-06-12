

function status(uId){
    $.ajax({
        url:'/checkStatus/'+uId,
        method:'get',
        success:(response)=>{
            if(response.pending){
               $('#stat').modal('show')
               $('#status').html("Pending..... Please wait for response")
            }else if(response.confirm){
                $('#stat').modal('show')
               $('#status').html("Congratulations. Your application had been Accepted. Our executive will contact you soon")
            }else{
                $('#stat').modal('show')
                $('#status').html("Sorry your profile not matches with our requirements.")
            }
        }
    })
}
// $('#cancel').click(function(){
   
//     let id = $()
// })

function cancel(uId){
    $('#cancelled').modal('show')
    if($('#yes').click(function(){
        $.ajax({
            url:'/cancelRequest/'+uId,
            method:'get',
            success:(response)=>{
                if(response.status){
                    location.reload()
                }
            }
        })
    }))
    $('#cancelled').modal('hide')
}


// function notify(uId){
    
//         $.ajax({
//             url:'/notify/'+uId,
//             method:'get',
//             success:(status)=>{
                
//                 }
            
//         }) 
    

// }
function payment(jobId){
    $.ajax({
        url:'/employee/razorpay/'+jobId,
        
        method:'get',
        success:(response)=>{
            razropayPayment(response)
        }
    })
}
function razropayPayment(order){
    
    var options = {
        "key": "rzp_test_aXiLerJwygr3M5", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Job On",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
            verifyPaid(response,order)
           
        },
        
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
    function verifyPaid(payment,order){
        
        $.ajax({
            url:'/employee/verify-payment',
            data:{
                payment,
                order
            },
            method:'post',
            success:(response)=>{
                if(response.status){
                   location.href='/employee/jobs'

                }else{
                    alert("Transaction Failed")
                    location.href='/employee/addjob'
                }
            }
        })
   
    }
}

