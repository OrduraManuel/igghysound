<script setup>
import toBack from '@/components/toBack.vue'
import ModalContactMe from '@/components/modal/modalContact.vue'
import ModalBtn from '@/components/modal/btnModal.vue'
</script>

<template>
 <section id="contact">
        <toBack  where="/"/>
        <div class="row">
            <div class="col-12">
                <h2 class="section-heading-all">
                    <span>03.</span> Contattami
                 </h2><!-- page title end -->
            </div>
            <div class="col-lg-12">
                <h3 class="section-header">
                Vuoi lavorare con me alla tua prossima Hit?<br> 
                </h3><!-- section title end -->
            </div>
            <div class="col-lg-12">
                <h3 class="section-header">
                Mi trovi via email qui: 
                <a class="link-underline link-underline-contact contact-modal-launcher" href="mailto:contact@domainname.com">iwattz@igghysounds.com</a>
                </h3><!-- section title end -->
            </div>
            <div class="col-lg-12">
                <h3 class="section-header">

                O su Instagram:
                <a class="link-underline link-underline-contact contact-modal-launcher" href="https://www.instagram.com/igghysound/" target="_blank">iggysound</a>
                </h3><!-- section title end -->
            </div>
<!--
            <div class="col-4 col-contact section-txt">
                <h6 class="contact">
                    <span class="awesome">Street</span> Address
                </h6>                    
                <p>Piazza la bomba e Scappa 666</p>
            </div>
            <div class="inner-divider-post visible-mobile-devices"></div>
            <div class="col-md-4 col-contact section-txt">
                <h6 class="contact">
                    <span class="awesome">Phone</span> Number
                </h6>
                <p>+39 666 666 666</p>
            </div>
            <div class="inner-divider-post visible-mobile-devices"></div>
            <div class="col-md-4 col-contact section-txt">
                <h6 class="contact">
                    <span class="awesome">Email</span> Enquiry
                </h6>
                <p>
                    <a class="link-underline" href="mailto:contact@domainname.com">iwattz@igghysounds.com</a>
                </p>
            </div>
-->
        </div>    
        <ModalBtn :where="'ModalContact'" />

                <ModalContactMe />
</section>
</template>
<style lang="scss" scoped>
//scss
</style>