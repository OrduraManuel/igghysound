<script setup>
import { ref, onMounted, nextTick } from 'vue';

import lottie from 'lottie-web';

import { useAuthorStore } from '@/store'
import { storeToRefs } from 'pinia';

let props = defineProps({
	thisTrack: Object,
  index: String
});

const isImageLoaded = ref(false);

const AuthorStore = useAuthorStore()
const { Authors } = storeToRefs(AuthorStore)

const AuthorName = ref()
const AuthorImg = ref()


onMounted(async() => {
  await nextTick();

  const containerId = `spoty-${props.index}`;
  const container = document.getElementById(containerId);

  if (container) {
    lottie.loadAnimation({
      container: container, // Usa l'ID univoco qui
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/images/icon/spoty.json'
    });
  }

  const image = new Image();
  image.src = props.thisTrack.Img.Path;
  image.onload = () => {
    isImageLoaded.value = true;
  };
  findAuthor()
  console.log('props.thisTrack: ',props.thisTrack)
});

async function findAuthor(){
  await Authors.value.forEach(Author =>{
    if(Author.id == props.thisTrack.Author){
      AuthorName.value = Author.Name
      AuthorImg.value = Author.Img.Path
      console.log('AuthorImg.value : ', AuthorImg.value)
    }
  })
}


</script>
    <template v-if="Authors.value && props.thisTrack">
      <a class="galleryImg trackCard" :href="props.thisTrack.Src?.Href" target="_blank" v-if="props.thisTrack.Src">
        <div class="hitClass"  v-if="props.thisTrack.isFav">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>  
          <img class="imageMasonry"  v-if="isImageLoaded" :src="props.thisTrack.Img.Path" />
          <div class="photoArtist" >
            <img :src="AuthorImg" v-if="AuthorImg"/>
          </div>
          <div class="nameArtist" v-if="AuthorName">
            {{AuthorName}}
          </div>
          <p class="newHit" v-if="props.thisTrack.isFav "> New Hit</p>
          <div class="spoty" :id="`spoty-${index}`"></div>
          <div class="bgHover"></div>
      </a >
    </template>


<style scoped lang="scss">
.trackCard{
  width:100%;
  width:100%;
  cursor:pointer;
  position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    display: inline-block;
}
.skeletonCard{
    background: white;
}


.hitClass{

    span{
            position: absolute;
            display: block;
            &:nth-child(1){
                top: 0;
                left: -100%;
                width: 100%;
                height: var(--borderSize);
                background: linear-gradient(90deg, transparent, var(--brandPrimary));
                animation: btn-anim1 1s linear infinite;
            }
            &:nth-child(2) {
                top: -100%;
                right: 0;
                width: 2px;
                height: 100%;
                background: linear-gradient(180deg, transparent, var(--brandPrimary));
                animation: btn-anim2 1s linear infinite;
                animation-delay: .25s;
            }
            &:nth-child(3) {
                bottom: 0;
                right: -100%;
                width: 100%;
                height: var(--borderSize);
                background: linear-gradient(270deg, transparent, var(--brandPrimary));
                animation: btn-anim3 1s linear infinite;
                animation-delay: .5s;
            }
            &:nth-child(4) {
                bottom: -100%;
                left: 0;
                width: 2px;
                height: 100%;
                background: linear-gradient(360deg, transparent, var(--brandPrimary));
                animation: btn-anim4 1s linear infinite;
                animation-delay: .75s;
                }
        }  
}
@keyframes btn-anim1 {
  0% {
    left: -100%;
    
  }
  50%,100% {
    left: 100%;
    
  }
}
@keyframes btn-anim2 {
  0% {
    top: -100%;
    
  }
  50%,100% {
    top: 100%;
    
  }
}
@keyframes btn-anim3 {
  0% {
    right: -100%;
    
  }
  50%,100% {
    right: 100%;
    
  }
}
@keyframes btn-anim4 {
  0% {
    bottom: -100%;
    
  }
  50%,100% {
    bottom: 100%;
    
  }
}
</style>
