<script setup>
import { watchEffect, onMounted, ref } from 'vue';

import toBack from "@/components/toBack.vue";

import { useAuthorStore, useTrackStore } from '@/store'
import { storeToRefs } from 'pinia';

// Gestione Authors
const AuthorStore = useAuthorStore()
const { Authors } = storeToRefs(AuthorStore)
const { AuthorsLimit } = storeToRefs(AuthorStore)
const { nextAuthors } = storeToRefs(AuthorStore)
const { prevAuthors } = storeToRefs(AuthorStore)
const { Author } = storeToRefs(AuthorStore) // for manage the modal's opening

// Gestione Tracks
const TrackStore = useTrackStore()
const { Tracks } = storeToRefs(TrackStore)
const { TracksLimit } = storeToRefs(TrackStore)
const { nextTracks } = storeToRefs(TrackStore)
const { prevTracks } = storeToRefs(TrackStore)
const { Track } = storeToRefs(TrackStore) // for manage the modal's opening


async function  searchHandler() {
	await AuthorStore.getAllAuthors('Number')
  await TrackStore.getAllTracks('Number')
  .then(()=>{
console.log('dont do nothing please')
  })
}
onMounted(() => {
  watchEffect(() => {
    Authors.value = null;
    Tracks.value = null;
    searchHandler();
  });
});
</script>
<template>
  <section id="dashboard">
      <toBack where="/" />
      <div class="row">

      
        <div class="col-12 tabs">
          <div class="links">
            <router-link type="button" :to="{name: 'trackTable'}"><span>Tracks</span></router-link>
            <router-link :to="{name: 'authorTable'}"><span>Authors</span></router-link>            
            <!--<router-link to="404"><span>Img Manager</span></router-link>-->
          </div>
        </div>
        <div class="col-12 contents">
          <div class="content">
            <router-view></router-view>
          </div>
        </div>
      </div>
      </section>
</template>
<style lang="scss" scoped>
#dashboard {
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
  .row{
    width: 100%;
  }
      .contents{
        padding-top: 2dvh;
        width: 100%;
        height: 100%;
      }
      .links{
    width: 100%;
    height: var(--marginT);
    display:flex;
    justify-content: space-around;
    align-items: center;
    a{
      color: var(--txtLight);
      padding: .5rem 1.5rem;
      border: var(--border);
      transition: .6s all ease-in-out;
      &:hover{
        cursor: pointer;
        color: var(--txtDark);
        background: var(--txtLight);
        transform: skew(-20deg, 0deg);
        border: none;
        transition: .4s all ease-in-out;
        span{
          transform: skew(20deg, 0deg);
        }
      }
    }
    .router-link-active{
      cursor: pointer;
        color: var(--txtDark);
        background: var(--txtLight);
        transform: skew(-20deg, 0deg);
        border: none;
        transition: .4s all ease-in-out;
        span{
          transform: skew(20deg, 0deg);
        }
      }
    }
}
@media only screen and (max-width: 575px){
  #dashboard{
      .col-12{
        padding: 0!important;
        .content{
          margin-top:4dvh;
        }
      }

  }
}
</style>
