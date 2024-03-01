<script setup>
import { ref, onMounted } from 'vue';
import { useAuthorStore } from '@/store'
import { storeToRefs } from 'pinia';

let props = defineProps({
	thisTrack: Object,
});

const isImageLoaded = ref(false);



const AuthorStore = useAuthorStore()
const { Authors } = storeToRefs(AuthorStore)

const AuthorName = ref()

onMounted(()  => {
  const image = new Image();
  image.src = props.thisTrack.Img.Path;
  image.onload = () => {
    isImageLoaded.value = true;
  };
  findAuthor()
});

async function findAuthor(){
  //let Arr = Authors.value
  Authors.value.forEach(Author =>{
    if(Author.id == props.thisTrack.Author){
      AuthorName.value = Author.Name
      console.log(AuthorName.value,'values')
    }

  })
  console.log(AuthorName.value, 'QUESTOOOOOOOpunto find')
}
</script>
<template v-if="Authors">
    <td class='td tdNumber text-truncate'>{{props.thisTrack.Number}}</td>
    <td class='td text-truncate'>{{AuthorName}}</td>
    <td class='td text-truncate'>{{props.thisTrack.Title}}</td>
    <td class='td text-truncate'>
        <img :src="props.thisTrack.Img.Path" style="width: 60px"  v-if="isImageLoaded"/>
    </td>
    <td class='td'>
        <router-link class='my-auto btn btn-success' :to='{ name:"editTrack", params: {id: props.thisTrack.id}}'> edit</router-link>
    </td>    
</template>