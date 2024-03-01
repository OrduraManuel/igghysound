<template>
  <div ref="progressBar" class="progressBar">
  <div ref="progress" class="progress">
  <span ref="progressNumber">666</span>
  </div>
  </div>
 
  <toBack where="/Dashboard" />
  <section id="createStepper">
  <div class="row">
  <div class="col-12">
  <Wizard :validation-schema="validationSchema" @submit.prevent > <!-- @submitEvent="onSubmit" -->
  <Step class="slideInUp-enter-to" style="width: 100%; height: 35dvh; position: relative">
  <h1>Step 1/4</h1>
  <div class="d-flex justify-content-around">
  <div class="rowTitle">
  <label>Type this Track's title</label>
  <Field name="fullName" type="text" placeholder="Insert Track's title here" v-model="Track.Title" />
  <ErrorMessage name="fullName" />
  </div>
  <div class="rowAuthor">
    <div class="containerPick">
      <label>Pick this Track's author</label>
      <div class="pick">
        <div class="text">
          <p>Select your author</p>
        </div>
        <div class="btn">
          <a class="btnModal" type="button" data-bs-toggle="modal" data-bs-target="#pickAuthor">pick author</a>
        </div>
        <div class="selected slideInUp-enter-to" v-if="Track.Author">
          <div v-for="Author in Authors" :key="Author.id">
            <span v-if="Author.id == Track.Author">
            {{ Author.Name }}</span>
          </div>
        </div>
      </div>
    </div>
    <ErrorMessage name="trackAuthor" />
  </div>
  </div>
  </Step>
 
  <Step class="slideInUp-enter-to" style="width: 100%; height: 35dvh">
  <h1>step 2/4</h1>
 
  <div class="d-flex justify-content-around">
  <div class="containerPick">
  <label>Select this Track's cover</label>
  <div class="pick">
  <div class="text">
  <p id="almostLoadImg">Select your cover</p>
  </div>
  <div class="btn">
  <a class="btnModal" type="button" id="btnImg" @click="uploadStartImg">pick cover</a>
  </div>
  <img class="selected slideInUp-enter-to imgPreview d-none" :src="null" ref="imgPreview" />
  <input style="display: none" type="file" id="uploaderImg" ref="uploaderImg" @change="pickImage"
  accept="image/*" required />
  </div>
  </div>
  </div>
  </Step>
 
  <Step class="slideInUp-enter-to" style="width: 100%; height: 35dvh">
  <h1>step 3/4</h1>
  <div class="row">
  <div class="col-6">
  <div class="rowOption">
  <div class="containerPick">
    <label>Pick this Option's track</label>
      <div class="pick">
        <div class="text">
          <p>Select your Option:</p>
        </div>
        <div class="btn">
          <a class="btnModal" type="button" data-bs-toggle="modal" data-bs-target="#pickOptions">pick
          Option</a>
        </div>
        <div class="selected slideInUp-enter-to" v-if="Track.Src?.Option">
          <i class="fa-brands mr-3" :class="'fa-' + Track.Src?.Option"></i>
          <span> {{ Track.Src.Option }}</span>
        </div>
      </div>
  </div>
  <ErrorMessage name="trackSrcOption" />
  </div>
  </div>
  <div class="col-6">
  <div class="rowTitle">
  <label>Type this Track's link</label>
  <Field style="width: 100%" name="linkTo" type="text" placeholder="Insert Track's link here"
  v-model="Track.Src.Href" />
  <ErrorMessage name="linkTo" />
  </div>
  </div>
  </div>
  </Step>
  <Step class="slideInUp-enter-to" style="width: 100%; height: 35dvh">
  <h1>step 4/4</h1>
  <div class="row">
  <div class="col-12" id="isHit">
  <div class="checkLove" :class="{ isNotLove: !Track.isFav, isTrueLove: Track.isFav }">
  <div :class="{ notLove: !Track.isFav, isHit: Track.isFav }">
  <p class="mb-2">Is your Hit this Track?</p>
  <i :class="{
  icon: true,
  fas: Track.isFav,
  far: !Track.isFav,
  }" class="fa-heart fa-2x my-auto"></i>
  <Field name="isHit" type="checkbox" id="checkLove" class="mt-3" v-model="Track.isFav"
  :value="'false'" />
  <label for="checkLove">checkLove</label>
  <span class="hit1"></span>
  <span class="hit2"></span>
  <span class="hit3"></span>
  <span class="hit4"></span>
  </div>
  </div>
  <button @click="handleSubmit" class="ctaContainer"> 
  <a class="createBtn"> <!--{name: 'createTrack'}-->
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  Submit
  </a>
  </button>
  <ErrorMessage name="isHit" />
  </div>
  </div>
  </Step>
  <!-- STEP 1 MODAL-->
  <ModalChoice :where="'pickAuthor'">
    <div class="gridWrapper">
      <label :for="Author.id" class="radioCard" v-for="Author in Authors" :key="Author.id">
        <Field name="trackAuthor" type="radio" v-model="Track.Author" :id="Author.id" :value="Author.id" />
        <div class="cardContentWrapper">
          <span class="checkIcon"> </span>
          <div class="cardContent">
            <h4>{{ Author.Name }}</h4>
          </div>
        </div>
      </label>
    </div>
  </ModalChoice>
  <ModalChoice :where="'pickOptions'">
    <div class="gridWrapper">
      <label :for="srcOption.id" class="radioCard" 
      v-for="srcOption in srcOptions" :key="srcOption.id">
      <Field name="trackSrcOption" type="radio" 
      v-model="Track.Src.Option" :id="srcOption.id"
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
  </Wizard>
  </div>
  </div>
  </section>
 </template>
 
 <script setup>
 // manage modal
 import ModalChoice from "@/components/modal/modalCreate.vue";
 import ModalBtn from "@/components/modal/btnModal.vue";
 
 // import BACK
 import toBack from "@/components/toBack.vue";
 
 // import vue stuff
 import { watchEffect, ref, onMounted, onUnmounted } from "vue";
 import { useRouter } from "vue-router";
 
 // firebase Storage imports
 import { storage } from "@/api/config";
 import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
 } from "firebase/storage";
 
 // firebase Auth imports
 import getUser from "@/auth/getUser";
 
 // import store
 import { useTrackStore, useAuthorStore } from "@/store";
 import { storeToRefs } from "pinia";
 
 // import custom js
 import { resizeAndSetImage, previewImage } from "@/assets/js/resize.js";
 
 // validation scheme and Stepper components
 import { Field, ErrorMessage } from "vee-validate";
 import * as yup from "yup";
 import Wizard from "@/components/auth/stepper/wizard.vue";
 import Step from "@/components/auth/stepper/step.vue";
 
 // onMounted
 onMounted(() => {
  // Ascolta l'evento 'submitClicked' emesso dal componente Wizard
  //window.addEventListener('submitClicked', handleSubmit);
 
  watchEffect(() => {
  TracksNumber.value = null;
  });
 });
 // // // // STEP 0
 
 // This is the validationSchema for wizard.vue and step.vue
 const validationSchema = [
  yup.object({
  fullName: yup.string().required().label("Full Name"),
  trackAuthor: yup
  .string()
  .required()
  .oneOf([yup.ref("trackAuthor")], "Choose one author"),
  }),
  yup.object({
  // without vee validation control
  }),
  yup.object({
  linkTo: yup.string().required().label("linkTo"),
  trackSrcOption: yup
  .string()
  .required()
  .oneOf([yup.ref("trackSrcOption")], "Choose one option"),
  }),
  yup.object({
  // without vee validation control - nothing is required
  }),
 ];
 
 // const
 const router = useRouter();
 const currentUser = getUser;
 
 // const store
 const TrackStore = useTrackStore();
 const { Tracks } = storeToRefs(TrackStore);
 const AuthorStore = useAuthorStore();
 const { Authors } = storeToRefs(AuthorStore);
 const { Track } = storeToRefs(TrackStore);
 
 const { getAuthorById } = AuthorStore;
 
 const AuthorsList = ref();
 
 // const 4 submit
 const AuthorName = ref();
 const TracksNumber = ref();
 
 // let upload IMG
 let uploaderImg = ref();
 let uploadedImg = ref();
 let resizedImg = ref();
 let loadedImg = ref();
 let imgPreview = ref();
 
 //path firebase
 let uploadPath = ref();
 
 //progress bar
 let progressBar = ref();
 let progress = ref();
 let progressNumber = ref();
 
 // // // // STEP 2
 
 // function pick your Img
 function uploadStartImg() {
  uploaderImg.value.click();
 }
 
 //function start select image
 async function pickImage(event) {
  await previewImage(event, uploadedImg, imgPreview); // Chiamata alla funzione importata
  let almostLoadImg = ref("");
  almostLoadImg.value =
  'Hai selezionato:<br/> <i style="font-size: .7rem; font-weight: 500;">' +
  uploadedImg.value.name +
  "</i>";
  let loadedImg = document.getElementById("almostLoadImg");
  let btnImg = document.getElementById("btnImg");
  loadedImg.innerHTML = almostLoadImg.value;
  imgPreview.value.classList.remove("d-none");
  btnImg.setAttribute("style", "margin-top:15%;");
 }
 
 // // // // STEP 3
 // let srcOptions array
 let srcOptions = ref([
  { id: "0", name: "spotify" },
  { id: "1", name: "tidal" },
  { id: "2", name: "youtube" },
 ]);
 
 // // // // STEP LAST
 /**
  * @description Only Called when the last step is submitted
  */
 function onSubmit() {
  console.log("sono in onsubmit(formData)", payload);
  console.log("Track.value", Track.value);
  console.log("payload parse", JSON.parse(JSON.stringify(payload)));
  //handleSubmit
 }
 
 const handleSubmit = async () => {
  console.log("sono dentro handleSubmit");
  try {
  console.log('sono dentro try')
  const downloadIMG = await uploadFile(uploadedImg.value);
  console.log(downloadIMG, 'downloadamelo')
  if (downloadIMG) {
  await createTrack(downloadIMG);
 
 
  }
  } catch (error) {
  debugger
  router.push({
  name: "404Resource",
  params: { resource: error },
  });
  }
 };
 
 const createTrack = async (downloadIMG) => {
  console.log('sono in createTrack')
 
  Track.value.Img.Path = downloadIMG;
  console.log(Track.value,'track.value dicreateTrack')
  await TrackStore.createTrack(Track.value);
  router.push("/dashboard");
  resetTrack();
 };
 // const resetTrack reset my store Track.value
 
 const resetTrack = () => {
  Track.value = {
  Number: 1,
  Organizer: {
  id: '666',
  },
  Author: '',
  Title: '',
  isFav: '',
  Src: {
  Href: '',
  Option: '',
  },
  Img: {
  Name: '',
  Path: null
  },
  };
 };
 // function uploadFile(file) create a folder in firebase storage with the author's name of this track and upload this one, managed the process with one progress bar
 
 /* TODO: Check dato che la merda di @Dani spacca tutto */
 
 
 async function uploadFile(file) {
 
  const uploadPath = ref();
 
  const renamePath = async (myName) => {
  const thisAuthor = AuthorStore.getAuthorById(myName); 
  const withoutSpace = thisAuthor.Name.split(" ").join("-");
  return withoutSpace.split(`'`).join("-");
 }
  uploadPath.value = await renamePath(Track.value.Author);
  const storagePath = `${uploadPath.value}/${file.name}`;
 
  const storageRefs = storageRef(storage, storagePath);
  const metadata = {
  contentType: file.type,
  };
  if (file.type == "image/jpeg") {
  Track.value.Img.Name = file.name;
  }
  const uploadTask = uploadBytesResumable(storageRefs, file, metadata);
 
  return await new Promise((resolve, reject) => {
  uploadTask.on(
  "state_changed",
  (snapshot) => {
  const interpolation =
  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  progress.value.style.width = interpolation + "%";
  progressNumber.value.innerHTML = interpolation + "%";
  },
  (error) => {
  console.log("questo è l errore: ", error);
  reject(error);
  },
  async () => {
  console.log("questo è lo snapshot ref: ", uploadTask.snapshot.ref);
  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  if (file.type == "image/jpeg") {
  Track.value.Img.Path = downloadURL;
  console.log("image");
  }
  if (file.type == "audio/mpeg") {
  Track.value.Src.Song = downloadURL;
  console.log("image");
  }
  resolve(downloadURL);
  }
  );
  });
 }
 </script>
 
 <style lang="scss">
 input,
 select {
  margin: 10px 0;
  display: block;
 }
 
 #createStepper {
  padding: var(--marginR) var(--marginT);
  z-index: 9;
  margin: var(--marginT) var(--marginR) var(--marginB) var(--marginL) !important;
 
  .col-12,
  .col-6 {
  z-index: 1;
  }
 }
 
 .containerPick {
  width: 100%;
 
  .pick {
  //background:rgba(255,255,255,.3);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: var(--border);
 
  .text {
  width: 50%;
  color: white;
  align-items: center;
 
  p {
  margin-bottom: 0;
  padding: 2rem;
  }
  }
 
  .btn {
  width: 50%;
  align-items: center;
 
  .btnModal {
  //margin-top: 15%;
  padding: 0.5rem;
  background: var(--txtLight);
  color: var(--txtDark);
  border: none;
  border-radius: var(--radiusS);
  font-weight: 700;
  transition: all 0.25s ease-in-out;
 
  &:hover,
  :focus {
  background: transparent;
  border: var(--border);
  color: white;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: var(--radiusL);
  transition: all 0.25s ease-in-out;
  }
  }
  }
 
  .selected {
  position: absolute;
  width: 40%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -1.5rem;
  right: 5%;
  background: rgba(255, 255, 255, 0.5);
  color: var(--txtDark);
  backdrop-filter: blur(5px);
  border-radius: var(--radiusS);
  overflow: hidden;
  }
 
  img.selected {
  width: 40%;
  height: 100%;
  display: flex;
  top: -70%;
  background: transparent;
  backdrop-filter: blur(0px);
  border-radius: var(--radiusS);
  object-fit: cover;
  }
 
  audio.selected {
  background: transparent;
  }
  }
 }
 
 #isHit {
  display: flex;
  justify-content: center;
 
  .isTrueLove {
  border: none !important;
  border-radius: 0 !important;
  overflow: hidden;
  }
 
  .checkLove {
  width: 100%;
  cursor: pointer;
  position: relative;
 
  justify-content: center;
  align-items: center;
  text-align: center;
  display: inline-block;
 
  width: 30vw;
  height: 100%;
  border-radius: var(--radiusL);
  position: relative;
 
  flex-direction: column;
 
  color: var(--txtLight);
  padding: 3rem;
  transition: all 0.5s ease-in-out;
  border: var(--border);
 
  input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
 
  &:checked+label {
  background: var(--brandPrimaryD15);
 
  &:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
  }
  }
  }
 
  label {
  cursor: pointer;
  text-indent: -9999px;
  width: 100%;
  height: 3rem;
  background: rgb(78, 78, 78);
  display: block;
  border-radius: 100px;
  position: relative;
 
  &:after {
  content: "";
  position: absolute;
  top: 0%;
  left: 5%;
  width: 43%;
  height: 100%;
  background: var(--txtLight);
  border-radius: 90rem;
  transition: 0.3s;
  }
 
  &:active {
  &:after {
  width: 80%;
  }
  }
  }
  }
 
  .isHit {
  span {
  position: absolute;
  display: block;
  }
 
  .hit1 {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--brandPrimary));
  animation: btn-anim1 1s linear infinite;
  }
 
  .hit2 {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--brandPrimary));
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
  }
 
  .hit3 {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, var(--brandPrimary));
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
  }
 
  .hit4 {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, var(--brandPrimary));
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
  }
  }
 
  .noLoveContainer {
  background-color: transparent;
  display: inline-block;
  width: 100%;
  height: 100%;
 
  .notLove {
  span {}
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