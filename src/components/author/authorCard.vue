<script setup>
import { ref, onMounted,onBeforeMount } from 'vue';
//useAuthorStore
import { useAuthorStore} from '@/store'
import { storeToRefs } from 'pinia';

let props = defineProps({
	thisTrack: Object,
});

const AuthorStore = useAuthorStore()
const { Authors } = storeToRefs(AuthorStore)

const thisAuthor = ref()
const AuthorImg = ref()



onMounted(() => {
    console.log('mounted')
    findAuthor()
});
onBeforeMount(() =>{
    console.log('before')
    //findAuthor()
})
async function findAuthor(){
  await Authors.value.forEach( async Author =>{
    if(Author.id == props.thisTrack.Author){
        thisAuthor.value =  await Author
        console.log(Author,'questo è author')
        console.log(thisAuthor.value,'questo è THISauthor', thisAuthor.value.Name)
        //AuthorImg.value.src = thisAuthor?.value.Img.Path
        console.log(AuthorImg.value,'questa è la img src ')
    }
  })
}
</script>

<template v-if="thisAuthor.value">
    <div class=" cardAuthor">
        <div class="cardImage">
            <img ref="AuthorImg" class="img" :src="thisAuthor?.Img.Path">
            <div class="AuthorName"> {{thisAuthor?.Name}} </div>
            <div class="AuthorCategory">{{thisAuthor?.Category}}</div>
        </div>
        <div class="content">
            <p class="AuthorDescription"> {{thisAuthor?.Descr}} </p>
        </div>
    </div>
    <!--<p class="thisAuthor">{{thisAuthor}}</p>-->
</template>
<style lang="scss" scoped>

.cardAuthor {
    margin-top: 30px;
    width: 100%;
    max-height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-content: space-around;
    position: relative;
    margin-bottom: 30px;
    border-radius: var(--radiusM);
    background: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    .category {
    margin-top: 20px;
    }
    .cardImage {
    max-height: 20rem;
    min-height: 30%;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: -30px;
    border-radius: var(--radiusM);
    box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
    .AuthorName{
        position: absolute;
        bottom: 5%;
        left: 5%;
        color: var(--txtLight);
        z-index: 3;
    }
    .AuthorCategory{
        position: absolute;
        bottom: 5%;
        right: 5%;
        background: red;
        color: white;
        border-radius: var(--radiusL);
        width: 33%;
        margin-top: -3%;
        z-index: 3;
        padding:2%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &:before {
        content: "";
        background: inherit;
        width: 100%;
        height: 100%;
        box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
        display: block;
        z-index: 1;
        position: absolute;
        top: 30px;
        transform: scale(0.9);
        filter: blur(10px);
        opacity: 0.9;
        border-radius: var(--radiusM);
      }

      &:after {
        content: "";
        background-image: linear-gradient(0deg, rgb(0, 0, 0,.4) 0%, rgba(0, 0, 0, 0) 100%);
        width: 100%;
        height: 100%;
        box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
        display: block;
        z-index: 2;
        position: absolute;
        top:0;
        left:0;
        border-radius: var(--radiusM);

      }
      img {
        width: 100%;
        height: 100%;
        position: relative;
        pointer-events: none;

    }
    .card-caption {
    position: absolute;
    bottom: 15px;
    left: 15px;
    color: #fff;
    font-size: 1.3em;
    text-shadow: 0 2px 5px rgba(33, 33, 33, 0.5);
}

}

    .content{
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        padding: 1rem 1.5rem;
        .AuthorDescription{
            background: #f3f3f3;
            padding: 2%;
            border-radius: var(--radiusS);
            //margin-bottom:0;
        }
    }
}



</style>
