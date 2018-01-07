function getObjPath(object,path){
         var regex = /\./
         var pathArray = path.split(regex);
         var value;
         var tempObject =object;

         pathArray.forEach(function(d,index){

             if(tempObject.hasOwnProperty(d)){
                     tempObject=tempObject[d];
                 }else{
                    tempObject=null
                 }
             

         });

         return tempObject;
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