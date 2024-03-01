<script setup>
import toBack from '@/components/toBack.vue';
import ModalContactMe from '@/components/modal/modalContact.vue'
import ModalBtn from '@/components/modal/btnModal.vue'
</script>

<template>
    <section id="about" >
        <toBack  where="/"/>
                <div class="row">
                    <div class="col-lg-12">
                        <h2 class="section-heading-all">
                            <span>01.</span> IgghySound:  Igor Ambrosino
                        </h2>
                    </div>
                    <div class="inner-divider"></div>
                    <div class="col-lg-12">
                        <h3 class="section-header">
                            <br>
                            Mi occupo di Mix & Mastering da N anni per artisti ed etichette italiane e internazionali <br>
                            <br>
                        </h3>
                    </div>
                    <div class="col-md-4 section-txt">
                        <p> Ho iniziato nel 2019 come fonico e Mix & Mastering Engineer per l'etichetta indipendente <a class="link-underline" href="https://moldrecordslabel.com/" target="_blank">MOLD Records</a> e dal 2020 collaboro con <a class="link-underline" href="http://www.rickycarioti.com/" target="_blank">Ricky Carioti</a>.</p>
                    </div>
                    <div class="col-md-4 section-txt mb-5">
                        <p>Lavorando ai dischi di diversi artisti mainstream italiani su tracce hip-hop, pop moderno e rock.</p>
                        <router-link :to="`selections`" class="btn btn-about" >Ascolta i miei lavori</router-link>
                    </div>

                <ModalBtn :where="'ModalContact'" />
                </div>
                <ModalContactMe />
        </section>
</template>
<style scoped lang="scss">
.section-txt{
    .btn-about{
        width: 50%;
        background: rgba(255,255,255,.08);
        color: var(--brandPrimary);
        border: 2px solid var(--brandPrimary);
        text-transform: uppercase;
        font-weight: 650;
        overflow: hidden;
        position: relative;
        transition: all .55s ease-in-out;
        &:hover{
            background: var(--brandPrimary);
            border: 2px solid var(--brandPrimary);
            color: var(--light);
            transition: all .25s ease-in;
        }
        &:after{
            content: '';
            position: absolute;
            width: 20%;
            height: 120%;
            background: rgba(255,255,255,0.15);
            filter: blur(4px);
            transform: skewX(-55deg);
            top: -10%;
            right: 0;
            animation: specialFade .85s infinite;
        }
        &:before{
            content: '';
            position: absolute;
            width: 10%;
            height: 120%;
            background: rgba(255,255,255,0.3);
            filter: blur(4px);
            transform: skewX(-55deg);
            top: -10%;
            right: 0;
            animation: specialFade 1s infinite;
            animation-delay: .25s;
        }
    }
}
</style>