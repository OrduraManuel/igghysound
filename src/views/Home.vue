<script setup>

import { inject, ref, watchEffect, onMounted } from 'vue'


</script>

<template>
          <div class="hero-heading  animate__animated animate__delay animate__fadeInDown">
              <span class=" heroAnimated  d-none d-md-block">Mix</span> 
              <h2 class=" heroAnimated   d-none d-md-block">&</h2>
              <span class="heroAnimated  d-none d-md-block">Mastering</span> 
              <h2 class=" heroAnimated d-none d-md-block">Engineer</h2>
              <div class="d-md-none" style="margin-top: -10dvh">
                  <span class=" heroAnimated mobile ">Mix</span> 
                  <h2 class=" heroAnimated mobile">&</h2>
                  <span class="heroAnimated mobile ">Mastering</span> 
                  <h2 class=" heroAnimated mobile">Engineer</h2>
              </div>
          </div>
</template>