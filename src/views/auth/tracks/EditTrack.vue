<script setup >
import { watchEffect, ref, reactive, onMounted, inject } from "vue";
import toBack from '@/components/toBack.vue'
import { useRouter } from 'vue-router'

import { storage } from '@/api/config';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { useTrackStore, useAuthorStore } from '@/store'
import { storeToRefs } from 'pinia';

import { resizeAndSetImage, previewImage } from '@/assets/js/resize.js';

import ModalChoice from "@/components/modal/modalCreate.vue";

const TrackStore = useTrackStore()
const AuthorStore = useAuthorStore()
const { Authors } = storeToRefs(AuthorStore)

//props ID passata 
const props = defineProps({
  id: { type: Object, required: true},
})

//On mounted faccio andare SearchHandler che popola thisTrack con l'id della Props
onMounted(()=>{
    thisTrack.value = null
    //srcOptions = null
  searchHandler()
  //findAuthor()
})

const thisTrack = ref({});

const router = useRouter()

let srcOptions = ref([
  { id: "0", name: "spotify" },
  { id: "1", name: "tidal" },
  { id: "2", name: "youtube" },
 ]);


let uploaderImg = ref()
let uploadedImg = ref()
let resizedImg = ref()
let loadedImg = ref()
let imgPreview = ref()

let uploadPath = ref()

let progressBar = ref()
let progress = ref()
let progressNumber = ref()
const AuthorsList = ref()
const AuthorName = ref()

// function get thisTrack
async function  searchHandler() {
    thisTrack.value = await TrackStore.getTrack(props.id)//get('Tracks', props.id);
    console.log(thisTrack.value,'editttt this thisTrack.value')
    console.log(thisTrack.value.Src.Option,'thisTrack.value.Src.Option')

    await AuthorStore.getAllAuthors('Number')
    AuthorsList.value = Authors.value
    Authors.value.forEach(async Author =>{
        if(Author.id == thisTrack.value.Author){
            AuthorName.value = await Author.Name
            console.log(AuthorName.value,'questo è AUTHOR NAMEEEEE')
        }
    })
}

// function delete thisTrack
function deleteHandler(id) {
    TrackStore.deleteTrack(id)
    router.push('/dashboard');
}

async function updateHandler(id, updateTrack) {
    if(uploadedImg.value != null || undefined){
        await uploadFile(uploadedImg.value)
    }  
    TrackStore.updateTrack(id, updateTrack)
    .then(() =>{
        console.log(thisTrack.value,'dovrebbe esserci l src')
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

// function pick your Img
function uploadStartImg() {
  uploaderImg.value.click();
}


function pickImage(event) {
  previewImage(event, uploadedImg, imgPreview); // Chiamata alla funzione importata
}


async function uploadFile(file) {

  function renamePath(myName){
    const withoutSpace = myName.split(' ').join('-')
    uploadPath.value =  withoutSpace.split(`'`).join('-')
    console.log(uploadPath.value,'questo è UPLOAD PATHHHHHHHHH')
}
await renamePath(AuthorName.value)


const storagePath = `${uploadPath.value}/${file.name}`;
  const storageRefs = storageRef(storage, storagePath);
  const metadata = {
    contentType: file.type
  };
  if(file.type.startsWith('image/')){
    thisTrack.value.Img.Name = file.name;
    console.log('image')
  }
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
        if(file.type == 'audio/mpeg'){
            progressNumber.value.innerHTML = 'caricamento audio: '+ interpolation + '%'
        }
        //progressNumber.value.innerHTML = interpolation + '%'
      },
      (error) => {
        console.log('questo è l errore: ', error);
        reject(error);
      },
      async () => {
        console.log('questo è lo snapshot ref: ', uploadTask.snapshot.ref);
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if(file.type == 'image/jpeg'){
            thisTrack.value.Img.Path = downloadURL;
          console.log('image')
        }
        if(file.type == 'audio/mpeg'){
            thisTrack.value.Src.Song = downloadURL;
          console.log('image')
        }
        resolve(downloadURL);
      }
    )
  });
}

</script>
<template>
    <div class="editTrack" v-if="thisTrack">
        <div ref="progressBar" class="progressBar">
            <div ref="progress" class="progress"><span ref="progressNumber">666</span></div>
        </div>
        <toBack  where="/dashboard"/>

            <div class="row">
                <div class=" editHeader col-12 ">
                    <p>Stai modificando: </p>
                    <div class="label">
                        <h4>{{thisTrack.Title}}</h4>
                    </div>
                </div>
                <div class="editBody col-12">
                    <div class="row">
                        <div class="col-12 col-md-4 title squareHole">
                            <div class="label">
                                <p>Track Title:</p>
                                <input type="text" name="title" v-model="thisTrack.Title"  :placeholder="thisTrack.Title"  required> <!--v-model="newAuthor" :placeholder="props.thisTrack.Author" -->
                            </div>
                        </div>
                        <div class="col-12 col-md-4 author squareHole">  
                            <div class="containerPick">
                                <label>Track Author:</label>
                                <div class="pick">
                                    <div class="text">
                                    <p>Select your author</p>
                                    </div>
                                    <div class="btn">
                                    <a class="btnModal" type="button" data-bs-toggle="modal" 
                                    data-bs-target="#pickAuthor">pick author</a>
                                    </div>
                                    <div class="selected slideInUp-enter-to" v-if="thisTrack.Author">
                                    <div v-for="Author in AuthorsList" :key="Author.id">
                                        <span v-if="Author.id == thisTrack.Author">
                                        {{ Author.Name }}</span>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            <ErrorMessage name="trackAuthor" />

                            <ModalChoice :where="'pickAuthor'">
                                <div class="gridWrapper">
                                <label  class="radioCard" v-for="Author in AuthorsList" :key="Author.id">
                                    <input name="trackAuthor" type="radio" 
                                    v-model="thisTrack.Author" :id="Author.id" :value="Author.id" />
                                    <div class="cardContentWrapper">
                                        <span class="checkIcon"> </span>
                                        <div class="cardContent">
                                            <h4>{{ Author.Name }}</h4>
                                        </div>
                                    </div>
                                </label>
                                </div>
                            </ModalChoice>
                        </div>
                        <div class="col-6 col-md-2 number squareHole">
                            <div class="label mx-auto">
                                <label for="title">E' una hit?</label>
                                <input type="number" name="number" v-model="thisTrack.Number" :placeholder="thisTrack.Number" required> <!-- v-model="newNumber" :placeholder="props.thisTrack.Number" -->
                            </div>
                        </div>    
                        <div class="col-6 col-md-2 number squareHole">
                            <div class="label mx-auto">
                                <label for="title">La sua posizione:</label>
                                <input type="number" name="number" v-model="thisTrack.Number" :placeholder="thisTrack.Number"  required> <!-- v-model="newNumber" :placeholder="props.thisTrack.Number" -->
                            </div>
                        </div> 
                        <div class="col-12 col-md-4 link squareHole">
                            <div class="containerPick">
                                <label>Track Option:</label>
                                <div class="pick">
                                    <div class="text">
                                        <p>Select your Option</p>
                                    </div>
                                    <div class="btn">
                                        <a class="btnModal" type="button" data-bs-toggle="modal" 
                                        data-bs-target="#pickOptions">pick
                                        Option</a>
                                    </div>
                                    <div class="selected slideInUp-enter-to" v-if="thisTrack.Src?.Option">
                                        <i class="fa-brands mr-3" :class="'fa-' + thisTrack.Src?.Option"></i>
                                        <span> {{ thisTrack.Src.Option }}</span>
                                    </div>
                                </div>
                            </div>

                            <ModalChoice :where="'pickOptions'" v-if="thisTrack.Src?.Option">>
                                <div class="gridWrapper">
                                    <label class="radioCard" 
                                    v-for="srcOption in srcOptions" :key="srcOption.id">
                                        <input type="radio" 
                                            v-model="thisTrack.Src.Option"
                                            :id="srcOption.id" 
                                            :value="srcOption.name" />
                                        <div class="cardContentWrapper">
                                            <span class="checkIcon"> </span>
                                            <div class="cardContent">
                                                <h4>{{ srcOption.name }}</h4>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </ModalChoice>
                            <div class="label">
                                <label for="title">Get link:</label>
                                <input type="text" v-model="thisTrack.Src.Href"  name="src" :placeholder="thisTrack.Src?.Href" required v-if="thisTrack.Src?.Href">
                            </div>
                        </div>   
                        <div class="col-12 col-md-4 img squareHole">
                            <div class="label">
                                <label for="title">Get Image:</label>
                                <div class="imageContainer">
                                    <button class="btn btn-primary" @click="uploadStartImg">Pick your new Img</button>

                                    <img :src="thisTrack.Img?.Path" ref="imgPreview" class="imgPreview"/>
                                    <input type="file" 
                                    style="display:none" id="uploaderImg" class="mt-3" 
                                    ref="uploaderImg" @change="pickImage"
                                    accept="image/*" />
                                    <div  ref="loadedImg" class="d-none">burp</div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 my-5">
                            <div class="btnContainer d-flex justify-content-center">
                                <button type="button" class="btn btn-danger mx-5 "  @click="deleteHandler(props.id)" >Delete</button>
                                <button type="button" class="btn btn-primary mx-5 " @click="updateHandler(props.id, thisTrack )">Save changes</button> <!-- @click="handleEdit" -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
    <style lang="scss" scoped>


.editTrack{
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
                //max-width: 2.5rem;
                margin-top: .3rem;
            }
        }
    }
    .editBody{
        padding: 2% 0% 2% 0%;
        .label{
            display: flex;
            flex-direction: column;
            p{
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
                @media only screen and (max-width: 575px) {
                    input{
                    //border-radius: var(--radiusS);
                    max-width: auto!important;
                    //margin-top: .3rem;
                    }
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
                    width: 3rem;
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
