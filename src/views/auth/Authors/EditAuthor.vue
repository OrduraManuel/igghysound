<script setup >
//import { update, get } from "@/api/crud";
import { watchEffect, ref, reactive, onMounted, inject } from "vue";
import toBack from '@/components/toBack.vue'
import { useRouter } from 'vue-router'

import { storage } from '@/api/config';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { resizeAndSetImage, previewImage } from '@/assets/js/resize.js';

import { useAuthorStore } from '@/store'
const AuthorStore = useAuthorStore()

//props ID passata 
const props = defineProps({
  id: { type: Object, required: true},
})

//On mounted faccio andare SearchHandler che popola thisAuthor con l'id della Props
onMounted(()=>{
    thisAuthor.value = null
    //SrcOptions = null
  searchHandler()
})

const thisAuthor = ref({});

const router = useRouter()

const SrcOptions = [
  'Rock','Pop','Rap', 'Raggae', 'Metal'
]
let uploader;
let loaded = ref()
let imgPreview = ref()
let uploadedImg = ref()
let progressBar = ref()
let progress = ref()
let progressNumber = ref()

// function get thisAuthor
async function  searchHandler() {
    thisAuthor.value = await AuthorStore.getAuthor(props.id)//get('Authors', props.id);
}
// function delete thisAuthor
function deleteHandler(id) {
    AuthorStore.deleteAuthor(id)
    router.push('/dashboard');
}

async function updateHandler(id, updateAuthor) {
    await uploadFile(uploadedImg.value)
    AuthorStore.updateAuthor(id, updateAuthor)
    .then(() =>{
        console.log(thisAuthor.value,'dovrebbe esserci l src')
        router.push('/dashboard');
    })
    .catch(error => {
          router.push({
            name: '404Resource',
            params: { resource: error }
          })
        })
    searchHandler();
}

// function pick your file
function uploadStart() {
  uploader.click();
}
function pickImage(event) {
  previewImage(event, uploadedImg, imgPreview); // Chiamata alla funzione importata
}

/*
function previewImage(event) {
  uploadedImg.value = event.target.files[0];
  console.log(uploadedImg.value,'guarda il peso è APPENA caricata')
  if (uploadedImg != null) {
  }
  // Verifica il tipo di file, ad esempio, se è un'immagine
  if (!uploadedImg.value.type.startsWith('image/')) {
    console.error('Il file selezionato non è un\'immagine.');
    alert('Il file selezionato non è un\'immagine.');
    return;
  }
  const maxSizeKB = 500; // Massima dimensione in kilobyte
  const maxWidthOrHeight = 500; // Massima larghezza o altezza

    // Leggi il file come blob
    const reader = new FileReader();
  reader.onload = function() {
    const img = new Image();
    img.src = reader.result;
    img.onload = function(){
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calcola le nuove dimensioni in base al maxWidthOrHeight
        let newWidth, newHeight;
        if(img.width > img.height){
            newWidth = maxWidthOrHeight;
            newHeight = (img.height / img.width) * maxWidthOrHeight;
        } else {
            newHeight = maxWidthOrHeight;
            newWidth = (img.width / img.height) * maxWidthOrHeight;
        }
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
            if(blob.size / 1024 <= maxSizeKB){
                console.log(uploadedImg.value,'BEFORE new file')
                uploadedImg.value = new File([blob],uploadedImg.value.name, {type: uploadedImg.value.type});
                imgPreview.value.src = URL.createObjectURL(uploadedImg.value);
                console.log(uploadedImg.value,'AFTER new file')
            }else{
                console.error('L\'immagine selezionata supera la dimensione massima consentita.');
                alert('L\'immagine selezionata supera la dimensione massima consentita.');
            }
        }, uploadedImg.value.type, 0.9);
    };
  };
  reader.readAsDataURL(uploadedImg.value)
  console.log(uploadedImg.value,'guarda il peso è dopo il reader')
}

*/


/*
function previewImage(event) {
  uploadedImg.value = event.target.files[0];
  console.log(uploadedImg.value, 'in previewImage')
  if (uploaded != null) {
    let almostLoad = ref('');
    almostLoad.value = 'Hai selezionato: ' + uploadedImg.value.name + ' come Img!';
    loaded.value.classList.remove('d-none');
    loaded.value.innerHTML = almostLoad.value;
    
    var reader = new FileReader();
    reader.onload = function(){
        imgPreview.value.src = reader.result;
        console.log(reader.result, 'this is render result')
    };
    reader.readAsDataURL(uploadedImg.value);
  }
}
*/

async function uploadFile(file) {
  thisAuthor.value.Img.Name = file.name;


  const uploadPath = ref()

function renamePath(myName){
    const withoutSpace = myName.split(' ').join('-')
    uploadPath.value =  withoutSpace.split(`'`).join('-')
}
await renamePath(thisAuthor.value.Name)


const storagePath = `${uploadPath.value}/${file.name}`;
  const storageRefs = storageRef(storage, storagePath);
  const metadata = {
    contentType: file.type
  };
  const uploadTask = uploadBytesResumable(storageRefs, file, metadata);

  return await new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const interpolation = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress.value.style.width = interpolation + '%'
        if(file.type == 'image/jpeg'){
            progressNumber.value.innerHTML = 'caricamento cover: '+ interpolation + '%'
        }
      },
      (error) => {
        console.log('questo è l errore: ', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if(file.type == 'image/jpeg'){
            thisAuthor.value.Img.Path = downloadURL;
        }

        resolve(downloadURL);
      }
    )
  });
}

</script>
<template>
    <div class="editAuthor" v-if="thisAuthor">
            <div ref="progressBar" class="progressBar">
                <div ref="progress" class="progress"><span ref="progressNumber">666</span></div>
            </div>
            <toBack  where="/dashboard"/>
            <div class="row">
            <div class="editHeader">
                <div class="col-6 ">
                    <p>Stai modificando: </p>
                    <div class="label">
                        <h4>{{thisAuthor.Name}}</h4>
                    </div>
                </div>
                <div class="col-6">

                </div>
            </div>
            <div class="editBody">
                <div class="col-12 col-md-10 title squareHole">
                    <div class="label">
                        <h4 for="title">Author Name:</h4>
                        <input type="text" name="name" v-model="thisAuthor.Name"  :placeholder="thisAuthor.Name"  required> <!--v-model="newAuthor" :placeholder="props.thisAuthor.Author" -->
                    </div>
                </div>
                <!--
                <div class="col-4 author squareHole">       
                    <div class="label">
                        <label for="title">Author Descr:</label>
                        <input type="text" name="author" v-model="thisAuthor.Descr"  :placeholder="thisAuthor.Descr"  required> 
                    </div>
                </div>
                <div class="col-4 number ">
                    <div class="label squareHole">
                        <label for="title">La sua posizione:</label>
                        <input type="number" name="number" v-model="thisAuthor.Number" :placeholder="thisAuthor.Number" required> 
                    </div>
                </div>-->
                <!--
                <div class="col-6 link squareHole">
                    <div class="label">
                        <label for="title">Da dove proviene il link:</label>
                        <div class="gridWrapper" >
                            <label class="radioCard" v-for="SrcOption in SrcOptions" :key="SrcOption">
                                <input type="radio" 
                                :id="SrcOption" 
                                :value="SrcOption"
                                v-model="thisAuthor.Category"
                                />
                                <div class="cardContentWrapper">
                                <span class="checkIcon">
                                    
                                </span>
                                <div class="cardContent">
                                 
                                    <h4>{{ SrcOption}}</h4>
                                </div>
                                </div>
                                
                            </label>
                        </div>                    
                    </div>
                    
                    <div class="label">
                        <label for="title">Get members:</label>
                        <input type="text" v-model="thisAuthor.Members"  name="src" :placeholder="thisAuthor.Members" required v-if="thisAuthor.Src?.Href">
                    </div>
                    
                </div>    -->     
                  
                <div class="col-12 col-md-10 img squareHole">
                    <div class="label">
                        <label for="title">Get Image:</label>
                        <div class="imageContainer">
                            <button class="btn btn-primary" @click="uploadStart">Pick your new Img</button>

                            <img :src="thisAuthor.Img?.Path" ref="imgPreview" class="imgPreview"/>
                            <input type="file" 
                            style="display:none" 
                            id="uploader" class="mt-3" ref="uploader" @change="pickImage"
                            accept="image/*" />
                            <div  ref="loaded" class="d-none">burp</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 my-5">
                    <div class="btnContainer d-flex justify-content-center">
                        <button type="button" class="btn btn-danger mx-5 "  @click="deleteHandler(props.id)" >Delete</button>
                        <button type="button" class="btn btn-primary mx-5 " @click="updateHandler(props.id, thisAuthor )">Save changes</button> <!-- @click="handleEdit" -->
                    </div>
                </div>
            </div>
            </div>
    </div>
</template>
    <style lang="scss" scoped>


.editAuthor{
    .editHeader{
        p{
            margin-bottom: -1%;
            opacity: .6;
            font-style: italic;
        }
        .label{
            h4{
                color: var(--textLight);
            }
            input{
                border-radius: var(--radiusS);
                max-width: 2.5rem;
                margin-top: .3rem;
            }
        }

    }
    .editBody{
        .label{
            display: flex;
            flex-direction: column;
            label{
                margin-bottom: -1%;
                opacity: .6;
                font-style: italic;
            }
            input{
                border-radius: var(--radiusS);
                //max-width: 2.5rem;
                margin-top: .3rem;
            }
        }
        .number{
            display:flex;
            justify-content: flex-end;
                input{
                //border-radius: var(--radiusS);
                max-width: 2.5rem!important;
                //margin-top: .3rem;
                }
            }
        .link{
margin-top: calc(var(--borderSize) - var(--borderSize)  - var(--borderSize));
        }
        .img{
            margin-top: calc(var(--borderSize) - var(--borderSize)  - var(--borderSize));
            .imageContainer {
                display:flex;
                justify-content: space-between;
                .imgPreview{
                    width: 7rem;
                }
            }


        }
        .squareHole{
            border: var(--border);
            padding: 1rem;
            transition: .5s all ease-in-out;
            
            &:hover{
                transform: translateY(-6.66%);
                transition: .2s all ease-in-out;
                backdrop-filter: blur(10px);
                background: rgba(255,255,255,.2);
            }
        }
    }
}
.progressBar{
    position: absolute;
    top:0;
    left: 0;
    width: 100vw;
    height: var(--marginT);
    background: transparent;
    transform: scale(1.02);
    .progress{
        height: 100%;
        background: var(--brandPrimary);
        width: 0%;
        transition: .2s all ease-in-out;
        border-radius: 0;
        transform: skewX(-30deg);
        display:flex;
        justify-content: flex-end;
        align-items: center;
        span{
            font-size: 1.7rem;
            color: var(--textLight);
            margin-right: 1rem;
        }
    }
}
</style>
