<script setup>
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFade, Autoplay } from 'swiper/modules';


const modules = [EffectFade, Autoplay]

</script>

<template>
<div class="container-swiper">
    <Swiper 
    class="mySwiper" 
    :effect="'fade'" 
    :autoplay="{
      delay: 2200,
      disableOnInteraction: true,
    }"
    :modules="modules" >
        <Swiper-slide  class="kenburns-slide-1"></Swiper-slide>
        <Swiper-slide class="kenburns-slide-2"></Swiper-slide>
        <Swiper-slide class="kenburns-slide-3"></Swiper-slide>
        <Swiper-slide class="kenburns-slide-4"></Swiper-slide>
  </Swiper>
</div>

</template>
<style lang="scss" scoped>
.container-swiper{
    position: fixed;
    top:0;
    right: 0;
}
.mySwiper{
    height: 100dvh;
    width: 100vw;

    z-index: 0;
    .swiper-slide{
        height: 100%;
        width: 100%;
        background-position: center;
        position:relative;
        &:after{
            content:'';
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.7);
        }
    }
    .kenburns-slide-1 {
        background-image: url(/images/homeHero/hero-bg-1.jpg);
        }
    .kenburns-slide-2 {
        background-image: url(/images/homeHero/hero-bg-2.jpg);
        }
    .kenburns-slide-3 {
        background-image: url(/images/homeHero/hero-bg-3.jpg);
        }
    .kenburns-slide-4 {
        background-image: url(/images/homeHero/hero-bg-4.jpg);
        }
}
</style>
