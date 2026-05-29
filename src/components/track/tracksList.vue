<script>
import heartIcon from '@/assets/icon/fa-heart.svg?raw';
import { search, remove, update } from "@/api/crud";
import { watchEffect } from "vue";
import toBack from '@/components/toBack.vue'

// firebase imports

export default {
    data() {
        return {
          Tracks: [],
          heartIcon,
        };
    },
    computed:{

    },
    methods:{
      async searchHandler() {
        this.Tracks = await search("Tracks");
      },

      async updateHandler(col, id, arg, value){

        if(arg == 'isRead'){
           update( col, id , {isRead : value})
           this.searchHandler();
        }
        if(arg == 'isFav'){
           update( col, id , {isFav : value})
           this.searchHandler();
        }
      },
      async deleteHandler(id) {
        remove("Tracks", id);
        this.searchHandler();
      },
    },  
    created(){
      watchEffect( () =>{
          this.Tracks = null;
          this.searchHandler();
        })
    }
}
</script>


<template>
    <toBack  where="/"/>
    <div class="row">
      <transition-group tag="ul" name="slideInUp" class="listTrack" appear>
        <li  v-for="Track in Tracks" :key="Track.id"  >
          <div class="forContent" >
            <router-link :to="{ name:'editTrack', params: {id: Track.id}}">
              testone
            </router-link>
            <div class="details">
              <h3 @click="deleteHandler(Track.id)">{{ Track.title }}</h3>
              <p>By {{ Track.author }} </p>
            </div>
            <div class="toggling">
                <span
                  :class="{ 'is-filled': Track.isFav }"
                  class="heart-icon my-auto"
                  v-html="heartIcon"
                  @click="updateHandler('Tracks', Track.id, 'isFav', !Track.isFav)"
                ></span>
            </div>
          </div>
        </li>   
    </transition-group> 
    </div>

  </template>
<style scoped lang="scss">
.heart-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  line-height: 0;
  cursor: pointer;
}

.heart-icon :deep(svg) {
  width: 1.7rem;
  height: 1.7rem;
}

.heart-icon.is-filled :deep(path) {
  fill: currentColor;
}
</style>
