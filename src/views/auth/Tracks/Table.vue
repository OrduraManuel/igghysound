<script setup>
  import tableTracks from "@/components/auth/Tracks/tableTracks.vue";  
  import toBack from "@/components/toBack.vue";
</script>
<template>
  <div id="trackDashboard">
      <toBack where="/" />
      <div class="row">
        <div class="col-12">
              <tableTracks />
          <div class="ctaContainer">    
            <router-link class="createBtn" :to="{name: 'createStepper'}"> <!--{name: 'createTrack'}-->
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