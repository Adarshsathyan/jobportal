$(document).ready(function(){

    $image_crop=$('#image_demo').croppie({
        
        enableExif:true,
        viewport:{
            width:200,
            height:200,
            type:'square'
        },
        boundary:{
            width:300,
            height:300
        }
        
    });
    
    $('#logo').on('change',function(){
        var reader =new FileReader();
        reader.onload=function(event){
            $image_crop.croppie('bind',{
                url:event.target.result
            }).then(function(){
                console.log("Jquery bind"); 
            })
        }
        reader.readAsDataURL(this.files[0]);
        $('#uploadimageModal').modal('show');
    });
    $('.crop_image').click(function(event){
        $image_crop.croppie('result',{
            type:'canvas',
            size:'viewport'
        }).then(function(response){
           
            document.getElementById('selected_image').value=response
            $.ajax({
                success:(response)=>{
                $('#uploadimageModal').modal('hide')
               $('#selected_image').html(response)
               
            }
            })
        })
    })
})