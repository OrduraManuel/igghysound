<script setup>
import toBack from '@/components/toBack.vue'
import ModalContactMe from '@/components/modal/modalContact.vue'
import ModalBtn from '@/components/modal/btnModal.vue'

</script>

<template>
    <section  id="services">
            <toBack  where="/"/>
            <div class="row">
                
            
                <div class="col-12">
                    <h2 class="section-heading-all">
                        <span>02.</span> Mix & Mastering online
                    </h2>
                </div>
                <div class="col-12 ">
                    <h3 class="section-header mt-5">
                        Come funziona? Lavoriamo insieme, ecco gli step:
                    </h3>
                </div>
                <div class="col-md-4 col-services section-txt">
                    <h6 class="services ">
                        <span class="awesome">01.</span> Mandami una mail
                    </h6>
                    <p>Contattami alla email: <a class="link-underline" href="#">work@igghysound.com</a> con il link ai file multitraccia del tuo brando da mixare e/o masterizzare.
                        <br>Potresti usare piattaforme come:
                        <a class="link-underline" href="https://wetransfer.com/">WeTransfer</a>,  <a class="link-underline"
                        href="https://www.dropbox.com/">Dropbox</a> o  <a class="link-underline"
                        href="https://www.google.com/intl/it_it/drive/">GDrive</a>.
                    </p>
                </div>
                <div class="col-md-4 col-services section-txt">
                    <h6 class="services">
                        <span class="awesome">02.</span> Lavorazioni in corso
                    </h6>
                    <p>Entro 5/10 giorni lavorativi dalla ricezione del file avrail il tuo brano per revisione. <a class="link-underline"
                       href="#">Sono inclusi fino a 3 round di modifiche nel prezzo</a>.
                    </p>
                </div>
                <div class="col-md-4 col-services section-txt">
                    <h6 class="services">
                        <span class="awesome">03.</span> Fai grande il tuo Brand!
                    </h6>
                    <p>Il tuo brano è pronto per essere pubblicato! In alta qualità, <a class="link-underline"
                        href="#">ottimizzato per l'ascolto su tutte le piattaforme online </a>
                     </p>
                </div>
                <ModalBtn :where="'ModalContact'" />
        </div>


                <ModalContactMe />
    </section>  
</template>

<style lang="scss" scoped>
</style>