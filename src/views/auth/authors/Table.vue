<script setup>
  import tableAuthors from "@/components/auth/Authors/tableAuthors.vue";
  import toBack from "@/components/toBack.vue";
</script>
<template>
  <div id="authorsDashboard">
      <toBack where="/" />
      <div class="row">


        <div class="col-12">
              <tableAuthors />
          <div class="ctaContainer">    
            <router-link class="createBtn" :to="{name: 'createAuthor'}">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              ADD 
            </router-link>
          </div>
        </div>
      </div>
  </div>
</template>
<style lang="scss" scoped>
#dashboard {

}

</style>
