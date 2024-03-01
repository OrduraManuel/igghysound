<script setup>
import toBack from '@/components/toBack.vue';

import { watchEffect, ref, onMounted } from 'vue';

// firebase imports

import { storage } from '@/api/config';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { useAuthorStore } from '@/store'
import { storeToRefs } from 'pinia';

import getUser from '@/auth/getUser';

import { useRouter } from "vue-router";

import { resizeAndSetImage, previewImage } from '@/assets/js/resize.js';

const router = useRouter();
const currentUser = getUser;

const AuthorStore = useAuthorStore()
const { Authors } = storeToRefs(AuthorStore)


const SrcOptions = [
  'Rock','Pop','Rap', 'Raggae', 'Metal'
]

const Author = ref({
  Number: '',
  Organizer: {
    id: '666',
  },
  Name: '',
  Category: [],
  Descr: '',
  Members: [],
  Songs: [],
  Img: {
    Name: '',
    Path: null
  },
})

onMounted(() => {
  watchEffect(() => {
    AuthorsNumber.value = null;
    searchHandler();
  });
});

let AuthorsNumber = ref();


// function search
async function searchHandler() {
  AuthorsNumber.value = await AuthorStore.numberOfAuthors();
  AuthorsNumber.value++;
  Author.value.Number = AuthorsNumber.value

}

//let uploader;
let uploaderImg = ref()
let uploadedImg = ref()
let imgPreview = ref()

let progressBar = ref()
let progress = ref()
let progressNumber = ref()

// function pick your file
function uploadStart() {
  uploaderImg.value.click();
}

async function pickImage(event) {
  await previewImage(event, uploadedImg, imgPreview); // Chiamata alla funzione importata
    let almostLoad = ref('');
    almostLoad.value = 'Hai selezionato: ' + uploadedImg.value.name + ' come Img!';
    let loaded = document.getElementById('almostLoad');
    loaded.classList.remove('d-none');
    loaded.innerHTML = almostLoad.value;
}

/*
function previewImage(event) {
  uploadedImg.value = event.target.files[0];
  console.log(uploadedImg.value, 'in previewImage')
  if (uploaded != null) {
    let almostLoad = ref('');
    almostLoad.value = 'Hai selezionato: ' + uploadedImg.value.name + ' come Img!';
    let loaded = document.getElementById('almostLoad');
    loaded.classList.remove('d-none');
    loaded.innerHTML = almostLoad.value;
  } else {
    console.log('uploaded è null')
  }
}
*/

async function uploadFile(file) {
  
  Author.value.Img.Name = file.name;

  const uploadPath = ref()
  function renamePath(myName){
    const withoutSpace = myName.split(' ').join('-')
    uploadPath.value =  withoutSpace.split(`'`).join('-')
}
await renamePath(Author.value.Name)
console.log(uploadPath.value,'questa è la path che inietterà')
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
        console.log('questo è lo snapshot ref: ', uploadTask.snapshot.ref);
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if(file.type == 'image/jpeg'){
          Author.value.Img.Path = downloadURL;
          console.log('image')
        }
        resolve(downloadURL);
      }
    )
  });
}

// function create
const handleSubmit = async () => {
  try {
    const downloadURL = await uploadFile(uploadedImg.value);
    if (downloadURL) {
      await createAuthor(downloadURL);
      resetAuthor();
      router.push('/dashboard');
    }
  } catch (error) {
    router.push({
      name: '404Resource',
      params: { resource: error }
    });
  }
};

const createAuthor = async (downloadURL) => {
  Author.value.Img.Path = downloadURL;
  await AuthorStore.createAuthor(Author.value);
};

const resetAuthor = () => {
  Author.value = {
    Number: '',
    Title: '',
    Author: '',
    Img: '',
    Src: '',
    isFav: false
  };
};


</script>
<template>
  <div id="create" v-if="Author">
    <div ref="progressBar" class="progressBar">
        <div ref="progress" class="progress"><span ref="progressNumber">666</span></div>
      </div>
      <toBack where="/Dashboard" />

    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <form  id="createForm" action="#" @submit.prevent class="createAuthorForm container-fluid">
            <div class="row my-5">
              <div class="col-6 mx-auto">
                <label for="title">Author name:</label>
                <input type="text" name="name" v-model="Author.Name" placeholder="Inserisci il nome dell autore"
                  required>
              </div>
              <div class="col-6 mx-auto">
                <div class="ImgImage">
                  <span class="mb-2">Upload this Img</span>
                  <button class="btn btn-primary" @click="uploadStart">Choose your Img</button>
                  <img :src="null" ref="imgPreview" class="imgPreview"/>
                  <input style="display:none" type="file" 
                    id="uploaderImg" class="mt-3"
                    ref="uploaderImg" @change="pickImage"
                    accept="image/*" />
                  <div id="almostLoad" class="d-none">burp</div>
                </div>
              </div>
            </div>
            <div class="ctaContainer">
              <a class="createBtn" @click="handleSubmit">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Add Author
              </a>
            </div>
            
          </form>
        </div>
      </div>
    </div>


  </div>
</template>
<style scoped lang="scss">
#almostLoad {
  font-size: 20px;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: var(--radiusM);
;  color: white;
  background: rgba(255,255,255,.2);
}
.imgPreview{
    width: 7rem;
  }

#createForm{
  position: relative;

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
.ctaContainer{
  bottom: -20%;
}
</style> 
