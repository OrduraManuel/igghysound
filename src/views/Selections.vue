<script setup>
import { onUnmounted, onMounted,watchEffect, ref  } from 'vue'

import toBack from '@/components/toBack.vue'
import TrackCard from '@/components/track/trackCard.vue'

import { useTrackStore, useAuthorStore } from '@/store'
import { storeToRefs } from 'pinia';

const TrackStore = useTrackStore()
const { Tracks } = storeToRefs(TrackStore)

const AuthorStore = useTrackStore()
const { Authors } = storeToRefs(AuthorStore)


watchEffect( () =>{
});

const containerApp = document.getElementById('app')

let widthB = 33
       // seleziona LOGO e togli l'unità di misura
      let claim = document.getElementById('claim')
       claim.style.width = '33'
       
       let widthClaim = claim.style.width.slice(0, -1)
   
      // calcola la larghezza superiore togliendo quella del logo
      let calculateBottom = widthB - (widthClaim / 3)  ;    
       const b1 = document.getElementById('b1')
       const b2 = document.getElementById('b2')


function openBorders(){
    const openMove = [
            { width: (calculateBottom - 25 ) + '%'},
            { width: 0 + '%'},
            { height: 2 + 'px'},
        ]
    const openTime = {
            duration: 666,
            iterations: 1,
        }   
    setTimeout(claim.style.opacity = 0 , 666)
    b1.animate(openMove,openTime)
    b2.animate(openMove,openTime)
    //itemB.style.width = calculateBottom + '%';
    b1.style.width = 0 + '%';
    b2.style.width = 0 + '%';
}
function closeBorders(){
    const closeMove = [
            { width: 0 + '%'},
            { width: (calculateBottom - 25 ) + '%'},
            { height: 2 + 'px'},
        ]
    const closeTime = {
            duration: 666,
            iterations: 1,
        }   
    setTimeout(claim.style.opacity = 1 , 666)
    b1.animate(closeMove,closeTime)
    b2.animate(closeMove,closeTime)
    //itemB.style.width = calculateBottom + '%';
    b1.style.width = calculateBottom + '%';
    b2.style.width = calculateBottom + '%';
}

onMounted(() => {
    
    containerApp.style.overflow = 'auto'
    openBorders()
})
onUnmounted(() => {
    containerApp.style.overflow = 'hidden'
    closeBorders()
  })

</script>
<template>
    <section  id="selections">
        <toBack  where="/"/>
        <div class="row">
            <div class="col-12">
                <h2 class="section-heading-all">
                    <span>00.</span> Portfolio tracce
                </h2>
            </div>
            <div class="inner-divider"></div><!-- divider end -->
            <div class="col-12">
                <div class="gallery">
                    <TrackCard v-for='Track in Tracks'  :key="Track.Number" :index='Track.id' :thisTrack='Track'/>
                </div> 
            </div>
        </div>    
    </section>
</template>