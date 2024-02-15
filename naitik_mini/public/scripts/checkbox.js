let allInputs = document.getElementsByTagName("input");
 if(allInputs.length > 0){
     for(let i=0; i<allInputs.length; i++){
         if (allInputs[i].type == 'checkbox'){
           allInputs[i].checked = false;
         //   count++;
         }
         }
     }
 alert("Unchecked " + allInputs.length + " boxes, which were a potential to be misled to be used.");