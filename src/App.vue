<script setup>
import { inject, ref, watchEffect, onMounted } from 'vue'

import { useTrackStore, useAuthorStore } from '@/store'
import { storeToRefs } from 'pinia';

import NewNav from "@/components/newNav.vue";
import Borders from "@/components/borders.vue";
import Swiping from "@/components/swiping.vue";

// GSTORE DA RIPOSIZIONARE

const GStore = inject('GStore')
let flashDiv



 async function flashMessageOut(){
   flashDiv = await document.getElementById('FlashMessage');
   if(flashDiv){
     setTimeout(()=>{
       flashDiv.classList.remove('animate__fadeInRight')
       flashDiv.classList.add('animate__fadeOut')
     },1500)
   }
 }


const TrackStore = useTrackStore()
const { Tracks } = storeToRefs(TrackStore)

const AuthorStore = useAuthorStore()
const { Authors } = storeToRefs(AuthorStore)

async function  searchHandler() {
	await TrackStore.getAllTracks('Number');
  await AuthorStore.getAllAuthors('Number');
}
onMounted(() => {
  searchHandler()
  watchEffect(() => {
   if(GStore){
     flashMessageOut()
   }
 })
       
})
</script>
<template>
  <div class="container-fluid">
    <div id="FlashMessage" v-if="GStore.flashMessage"> {{ GStore.flashMessage }}</div>
    <Swiping />
    <NewNav />
    <Borders />
    <router-view 
    class="homethis animate__animated animate__delay animate__fadeIn" >
  </router-view>
  </div>
</template>
<style lang="scss">
#app{

}
</style>