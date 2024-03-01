<script>
  
import { search, remove, update } from "@/api/crud";
import { watchEffect } from "vue";
import toBack from '@/components/toBack.vue'

// firebase imports

export default {
    data() {
        return {
          Tracks: [],
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
                <i :class="{icon: true, 
                  'fas': Track.isFav, 'far': !Track.isFav }" 
                  class="fa-heart my-auto" @click="updateHandler('Tracks', Track.id, 'isFav', !Track.isFav)" ></i>
            </div>
          </div>
        </li>   
    </transition-group> 
    </div>

  </template>
  

  
