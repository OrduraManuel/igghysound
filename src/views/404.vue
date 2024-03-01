<template>
        <toBack where="/Dashboard"/>
        <div class="row">
            <div class="col-12">
                <div class="notFound">
                    <h1>Ooops!</h1>
                <h3>This {{resource}} url isn't exist.</h3>
                <h3>It looks like you're experiencingg some network issues, please take a breath and
                    <a href="#" @click="$router.go(-1)">here</a> for turn back </h3>
                </div>
            </div>
        </div>
  </template>
  <script>
  import toBack from '@/components/toBack.vue';

  export default {
     props: {
         resource: {
             type: String,
             required: true,
             default: 'page'
         }
          
      },
  }
  </script>
  <style scoped>
  .notFound{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      color:white;
  }
  
  </style>