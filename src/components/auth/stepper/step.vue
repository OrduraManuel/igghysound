<script setup>
import { computed, inject } from "vue";

// This is a ref injected from FormWizard
const STEP_COUNTER = inject("STEP_COUNTER");

// Clones the step index to get the step's index and advances it by 1 for the next step
// Meaning each step gets an index ID starting from 1
const currentIdx = STEP_COUNTER.value++;
console.log(currentIdx,'currentIdx')
// Grabs the live ref to the current form active step
const CURRENT_STEP_INDEX = inject("CURRENT_STEP_INDEX");
console.log(CURRENT_STEP_INDEX,'CURRENT_STEP_INDEX')
// If this step should be shown
const shouldShow = computed(() => {
  console.log(CURRENT_STEP_INDEX.value,'SHOULDSHOW - CURRENT_STEP_INDEX.value')
  return currentIdx === CURRENT_STEP_INDEX.value;
  
});
</script>
<template>
    <div v-if="shouldShow">
      <slot />
    </div>
</template>
  

<style lang="scss">
</style>