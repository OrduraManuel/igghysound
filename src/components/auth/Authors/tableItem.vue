<script setup>
import { ref, onMounted } from 'vue';

let props = defineProps({
	thisAuthor: Object,
});

const isImageLoaded = ref(false);

onMounted(() => {
  const image = new Image();
  image.src = props.thisAuthor.Img.Path;
  image.onload = () => {
    isImageLoaded.value = true;
  };
});
</script>
<template>
    <td class='td tdNumber text-truncate'>{{props.thisAuthor.Number}}</td>
    <td class='td text-truncate'>{{props.thisAuthor.Name}}</td>
    <td class='td text-truncate'>
        <img :src="props.thisAuthor.Img.Path" style="width: 60px"  v-if="isImageLoaded"/>
    </td>
    <td class='td'>
        <router-link class='my-auto btn btn-success' :to='{ name:"editAuthor", params: {id: props.thisAuthor.id}}'> edit</router-link>
    </td>    
</template>