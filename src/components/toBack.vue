<script setup >
import arrowLeftIcon from '@/assets/icon/fa-arrow-left.svg?raw';
const props = defineProps({
  where: { type: String }
})
</script>

<template>
  <router-link  :to="props.where" id="closer" class="section-closer animate__animated animate__delay-1s animate__backInDown closer">
    <span class="back-svg-icon" v-html="arrowLeftIcon"></span>
  </router-link>
</template>
<style scoped lang="scss">
.back-svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.back-svg-icon :deep(svg) {
  width: 1.5em;
  height: 1.5em;
}
</style>
