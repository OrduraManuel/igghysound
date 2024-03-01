import {  ref } from "vue";


const previewImage = async (e,container,msg,imageContainer) => {
    container = e.target.files[0];
    console.log(container,'container in previewImage');
    if(container != null){
        let almostLoad = ref('');
        almostLoad.value = 'Hai selezionato: ' + container.name + ' come Img!';
        console.log(msg,'quesot è msg dentro ')
        msg.classList.remove('d-none');
        msg.innerHTML = almostLoad.value;
        printImage(container, imageContainer)
    }
    else{
        console.log('are not anyone img to preview')
    }
  };

const printImage = async (file, container) => {
    var reader = new FileReader();
    reader.onload = function(){
        container.src = reader.result;
        console.log(reader.result, 'this is render result')
    };
    reader.readAsDataURL(file);//uploaded.value
  };

  export const uploadFile = async (file) =>{

  }
  export { previewImage, printImage}

  /*
  function printImage(file, container){
    var reader = new FileReader();
    reader.onload = function(){
        container.value.src = reader.result;
        console.log(reader.result, 'this is render result')
    };
    reader.readAsDataURL(file.value);//uploaded.value
}

*/
/*
function previewImage(e,container,msg,imageContainer) {
    container.value = e.target.files[0];
    console.log(container.value,'container in previewImage');
    if(container != null){
        let almostLoad = ref('');
        let msg = ref('');
        almostLoad.value = 'Hai selezionato: ' + container.value.name + ' come Img!';
        msg.classList.remove('d-none');
        msg.innerHTML = almostLoad.value;
        printImage(container, imageContainer)
    }
    else{
        console.log('are not anyone img to preview')
    }
}
*/

/* trackDetails version

/*
function previewImage(event) {
  uploaded.value = event.target.files[0];
  console.log(uploaded.value, 'in previewImage')
  if (uploaded != null) {
    let almostLoad = ref('');
    almostLoad.value = 'Hai selezionato: ' + uploaded.value.name + ' come Img!';
    let loaded = document.getElementById('almostLoad');
    loaded.classList.remove('d-none');
    loaded.innerHTML = almostLoad.value;
    
    var reader = new FileReader();
    reader.onload = function(){
        imgPreview.value.src = reader.result;
        console.log(reader.result, 'this is render result')
    };
    reader.readAsDataURL(event.target.files[0]);//uploaded.value
  } else {
    console.log('uploaded è null')
  }
}
*/

