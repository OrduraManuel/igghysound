<script setup>
import { useTrackStore } from '@/store'
import { storeToRefs } from 'pinia';

import { watchEffect, onMounted, ref } from 'vue';

import basicModal from '@/components/auth/basicModal.vue';
import tableItem from '@/components/auth/Tracks/tableItem.vue';

import loader from '@/components/loader.vue';


const TrackStore = useTrackStore()
const { Tracks } = storeToRefs(TrackStore)
const { TracksLimit } = storeToRefs(TrackStore)
const { nextTracks } = storeToRefs(TrackStore)
const { prevTracks } = storeToRefs(TrackStore)
const { Track } = storeToRefs(TrackStore) // for manage the modal's opening

async function  limitHandler() {
  await TrackStore.getLimitedTracks( perPage.value, 'Number')
  .then(()=>{
    prevBtn.value.classList.add('disabled')
      if( perPage.value > Tracks.value.length){
      nextBtn.value.classList.add('disabled')
      console.log('Authors.lenght',Tracks.value.length)
    }else{
      nextBtn.value.classList.remove('disabled')
    }
  })
}
async function  nextHandler() {
  await TrackStore.getNextTracks( perPage.value, 'Number',nextTracks.value)
  .then(async ()=>{
    prevBtn.value.classList.remove('disabled')
    let firstTracks = Tracks.value[0]
    let lastTracks = Tracks.value[Tracks.value.length - 1]
    let nextTracksId = await Reflect.get(nextTracks.value,'id')
    console.log('questo è reflect NEXT: ', nextTracksId,'lastTracks: ', lastTracks.id )

    if( lastTracks.id == nextTracksId){
      console.log('siamo uguali disabilitiamo il NEXT')
      nextBtn.value.classList.add('disabled')
    }
    let prevTracksId = await Reflect.get(prevTracks.value,'id')
    console.log('questo è reflect PREV: ', prevTracksId,'firstTracks: ', firstTracks )
    if( firstTracks.id != prevTracksId){
      console.log('siamo uguali disabilitiamo il PREV')
      prevBtn.value.classList.remove('disabled')
    }
  })
}
async function  predvhandler() {
  await TrackStore.getPrevTracks( perPage.value, 'Number',prevTracks.value)
  .then(()=>{
    let firstTracks = Tracks.value[0]
    let lastTracks = Tracks.value[Tracks.value.length - 1]
    let nextTracksId = Reflect.get(nextTracks.value,'id')
    if( lastTracks.id != nextTracksId){
      console.log('siamo uguali disabilitiamo il btnNext')
      nextBtn.value.classList.remove('disabled')
    }
    let prevTracksId = Reflect.get(prevTracks.value,'id')
    if( firstTracks.id == prevTracksId){
      console.log('siamo uguali disabilitiamo il btnNext')
      prevBtn.value.classList.add('disabled')
    }
  })
}
const prevBtn = ref()
const nextBtn = ref()

//let sel = ref(null);
let LimitTracks = [3,4,5];
let perPage = ref(3);


function activeModal(thisTrack){
  //! Non si può aggiorare la const Track
	// Track = thisTrack;
}

watchEffect( () =>{

	//Track.value = null;
    limitHandler();
});


</script>
<template>
  <div class='table-responsive' id="tableTracks">

    <table class='tableDashboard' v-if='TracksLimit'>
    <thead>
      <tr class='tableHead'>
        <th class='col colNumber'>#</th>
        <th class='col'>Author</th>
        <th class='col'>Title</th>
        <th class='col'>Image</th>
        <th class='col'>Action</th>
      </tr>
      
    </thead>
    <tbody>
      <tr v-for='TrackLimit in TracksLimit' :key='TrackLimit.id'>
        <tableItem :thisTrack='TrackLimit'/>
        <!--
        <td class='td'>
          <button
          class='my-auto btn btn-success' 
          data-bs-toggle="modal" 
          data-bs-target="#exampleModal"
          @click='activeModal(Track)'> edit in modal</button>
        </td>
                  data-bs-toggle='modal' 
          data-bs-target='#exampleModal' -->
      </tr>
    </tbody>
    </table>   
    <table v-else>
        <loader>
          <i class="fa fa-spinner" aria-hidden="true"></i>
        </loader>  
    </table>
  </div>
    <nav class="mx-auto my-5" aria-label="Page navigation example">
      <ul class="pagination pagination-lg justify-content-center" >
        <li class="page-item">
          <select v-model="perPage" value="3" class="page-link">
            <option v-for="LimitTrack in LimitTracks" :value="LimitTrack" :key="LimitTrack.id">
              {{ LimitTrack }}
            </option>
          </select>
        </li>
        <li class="page-item">
          <a class="page-link  disabled" ref="prevBtn" href="#" aria-label="Previous"  @click="predvhandler">
            <span aria-hidden="true">PREV</span>
          </a>
        </li>
        <li class="page-item" >
          <a class="page-link "  ref="nextBtn"  href="#" aria-label="Next" @click="nextHandler">
            <span aria-hidden="true">NEXT</span>
          </a>
        </li>
      </ul>
    </nav>
 
  <template>
    <basicModal 
    :thisTrack='TrackLimit' 
    /> <!-- !== null || sel !== undefined-->

  </template>
    <!--v-if=' sel !== null'-->
</template>
<style scoped lang="scss">

</style>