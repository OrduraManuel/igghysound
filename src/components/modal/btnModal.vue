<script setup >
const props = defineProps({
  where: { type: String }
})
let isWhere = '#'+props.where
console.log(isWhere,'questo è il div')
</script>
<template>
  <Teleport to="body"> <!-- mobile teleport -->
      <div class="ctaContainer d-md-none">
          <a  class="createBtn" data-bs-toggle="modal" :data-bs-target="isWhere">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span class="cta-label">Contattami</span>
          </a>
      </div>
  </Teleport>

  <div class="ctaContainer d-none d-md-block"><!-- desktop not teleport -->
    <a  class="createBtn" data-bs-toggle="modal" :data-bs-target="isWhere">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span class="cta-label">Contattami</span>
    </a>
  </div>

</template>
<style lang="scss" scoped>
.ctaContainer .createBtn .cta-label {
  position: static;
  display: inline;
  font-weight: inherit;
}
</style>
