<template>
  <form @submit="onSubmit">
    <slot />

    <div>
      <button v-if="hasPrevious" type="button" @click="goToPrev" class="ctaContainer prev">    
          <a class="createBtn"> <!--{name: 'createTrack'}-->
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Previous
          </a>
      </button>
      <button type="submit" class="ctaContainer" v-if="!isLastStep">    
          <a class="createBtn"> <!--{name: 'createTrack'}-->
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Next
          </a>
      </button>

     <!-- <button type="submit">{{ isLastStep ? "Submit" : "Next" }}</button>-->
    </div>
  </form>
</template>

<style lang="scss">

</style>

<script setup>
import { useForm } from "vee-validate";
import { ref, computed, provide, getCurrentInstance } from "vue";

const props = defineProps({
  validationSchema: {
    type: Array,
    required: true,
  },
});

const formData = ref({});
const currentStepIdx = ref(0);

const { emit } = getCurrentInstance();

// Injects the starting step, child <form-steps> will use this to generate their ids
const stepCounter = ref(0);
provide("STEP_COUNTER", stepCounter);
// Inject the live ref of the current index to child components
// will be used to toggle each form-step visibility
provide("CURRENT_STEP_INDEX", currentStepIdx);

// if this is the last step
const isLastStep = computed(() => {
  return currentStepIdx.value === stepCounter.value - 1;
});

// If the `previous` button should appear
const hasPrevious = computed(() => {
  return currentStepIdx.value > 0;
});

// extracts the individual step schema
const currentSchema = computed(() => {
  return props.validationSchema[currentStepIdx.value];
});

// vee-validate will be aware of computed schema changes
const { resetForm, handleSubmit } = useForm({
  validationSchema: currentSchema,
});

// We are using the "submit" handler to progress to next steps
// and to submit the form if its the last step
// parent can opt to listen to either events if interested
const onSubmit = handleSubmit((values) => {
  formData.value = {
    ...formData.value,
    ...values,
  };

  // Sets initial values for the values already filled
  // effectively fills the inputs when clicking on "previous"


  if (!isLastStep.value) {
    currentStepIdx.value++;
    //emit("next", formData.value);
    console.log('lastStep è FALSE: ',isLastStep.value)
    console.log('this is current step idx: ',currentStepIdx.value)
    return;
  }
  if (isLastStep.value) {
    //emit("submit", formData.value);
    //emit("submit", 'arfonso');
    console.log('lastStep è TRUE: ',isLastStep.value)

  }

  emit("submitEvent", formData.value);
});

const handleFormSubmit = () => {
  if (isLastStep.value) {
    //window.addEventListener('submitClicked', handleSubmit);
  }
};

function goToPrev() {
  if (currentStepIdx.value === 0) {
    return;
  }

  currentStepIdx.value--;
  resetForm({
    values: {
      ...formData.value,
    },
  });
}
</script>