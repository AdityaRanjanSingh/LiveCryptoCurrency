function getObjPath(object,path){
         var regex = /\./
         var pathArray = path.split(regex);
         var value;
         var tempObject=object;

         pathArray.forEach(function(d,index){

             if(tempObject.hasOwnProperty(d)){

                 if(index === pathArray.length-1){
                     value = tempObject[d];

                 }else{
                     tempObject=tempObject[d];
                 }
             }

         });
         if(value){
             return value;
         }else{
             return null
         }


        }

        var emp = {
          name: "Rajesh",
          address : {
                 locality : {
                       street : "2nd main domlur"
                  }
            }
        }
        var data = getObjPath(emp, 'address.locality.street')