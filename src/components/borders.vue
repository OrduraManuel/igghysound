<script setup>
import { ref, onMounted } from 'vue'


onMounted(() => {
    const bordersT = ref()
    const bordersB = ref()
    const bordersW = ref()
    // seleziona e cicla border top 1 e 2
    bordersT.value = document.getElementsByClassName('border-top')
    for (let itemT of bordersT.value) {
        // seleziona unità con cui calcolare
        let widthF = 40
       
        // seleziona LOGO e togli l'unità di misura
        let logo = document.getElementById('logo')
        let widthLogo = logo.style.width.slice(0,.2)

        // calcola la larghezza superiore togliendo quella del logo
        let calculateTop = widthF - widthLogo   ;
        itemT.style.width = calculateTop + '%';
            // setta HEIGHT a 2px
        itemT.style.height = '2px'
        const moveT = [
            { width: 0 + '%'},
            { width: (calculateTop - 25 ) + '%'},
            { height: 2 + 'px'},

        ]
        const timeT = {
            duration: 1450,
            iterations: 1,
        }   
        const t1 = document.getElementById('t1')
        const t2 = document.getElementById('t2')
    t1.animate(moveT,timeT)
    t2.animate(moveT,timeT)
    }
    // seleziona e cicla border bottom 1 e 2
    bordersB.value = document.getElementsByClassName('border-bottom')
    for (let itemB of bordersB.value) {
        // seleziona unità con cui calcolare
        let widthB = 33
       
        // seleziona LOGO e togli l'unità di misura
        let claim = document.getElementById('claim')
        claim.style.width = '33'
        let widthClaim = claim.style.width.slice(0, -1)

        // calcola la larghezza superiore togliendo quella del logo
        let calculateBottom = widthB - (widthClaim / 3)  ;
        itemB.style.width = 0 + '%';
            // setta HEIGHT a 2px
        itemB.style.height = '2px'
        const moveB = [
            { width: 0 + '%'},
            { width: (calculateBottom - 25 ) + '%'},
            { height: 2 + 'px'},

        ]
        const timeB = {
            duration: 666,
            iterations: 1,
        }   
        const b1 = document.getElementById('b1')
        const b2 = document.getElementById('b2')

    setTimeout(
        animetemelo ,1450
        )
        
        function animetemelo(){
            itemB.style.width = calculateBottom + '%';
            b1.animate(moveB,timeB)
            b2.animate(moveB,timeB)
        }
    }

    // BORDER LATERALI
    bordersW.value = document.getElementsByClassName('border-width')
        // seleziona Border RIGHT
    let heightLaterals = document.getElementById('border-r')
        // seleziona HEIGHT e togli l'unità di misura
    let heightL = heightLaterals.style.height.slice(0, -1)
    for (let itemW of bordersW.value) {
        itemW.style.height = '100' + '%';
        const moveW = [
            { height: 0 },
            { height: heightL },
            { top: '0'}
        ]
        const timeW = {
            duration: 1450,
            iterations: 1,
        }
        itemW.animate(moveW,timeW)
        
    }
})
</script>
<template>
    <div class="borders-introduction  d-none d-md-block">
        <div class="borders-introduction-wrapper">
            <div class="border-wrapper" >
                <div class="border-inner">
                    
                    <div class="center-space-bottom  d-none d-lg-block">
                        <span id="claim"></span>
                    </div>
                    <div id="border-t">
                        <div id="t1" class="border-bg border-top border-top-1"></div>
                        <div id="t2"  class="border-bg  border-top border-top-2"></div>
                    </div>
                    <div id="border-b">
                        <div id="b1"  class="border-bg  border-bottom border-bottom-1"></div>
                        <div id="b2"  class="border-bg  border-bottom border-bottom-2"></div>        
                    </div>

                    <div class="border-bg  border-width border-left"></div>
                    <div id="border-r" class="border-bg  border-width border-right"></div><!-- borders end -->
                </div>
            </div>
        </div>
    </div>
</template>