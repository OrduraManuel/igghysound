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
                            Mi occupo di Mix & Mastering dal 2019 per artisti ed etichette italiane e internazionali <br>
                            <br>
                        </h3>
                    </div>
                    <div class="col-12 col-lg-6 section-txt">
                        <p>Nato professionalmente nel 2019, inizia il suo percorso come producer, mixing e mastering engineer ricoprendo il ruolo di fonico residente per l’etichetta discografica <a class="link-underline" href="https://moldrecordslabel.com/" target="_blank">Mold Records</a>. In questo contesto lavora a stretto contatto con diversi artisti, sia locali che nazionali, sviluppando una solida esperienza nella produzione musicale, nella registrazione e nella finalizzazione dei brani.</p>
                        <p>Nel 2020 incontra <a class="link-underline"  >Riky Carioti</a>, fonico di Elisa, con cui intraprende un percorso di formazione avanzata nel mixing e mastering. Da un rapporto inizialmente didattico nasce successivamente una collaborazione professionale su diversi progetti musicali.</p>
                    </div>
                    <div class="col-12 col-lg-6 section-txt section-txt-last mb-5">
                        <p>Nel corso degli anni ha lavorato con numerosi artisti emergenti e professionisti del settore, arrivando a contare centinaia di brani mixati e masterizzati. Tra le esperienze più rilevanti figura la collaborazione al mixing e mastering di “Ultimo Stadi 2023”, realizzata insieme a Riky Carioti.</p>
                        <p>Il suo approccio combina sensibilità musicale, cura del dettaglio sonoro e visione produttiva, con l’obiettivo di valorizzare l’identità di ogni artista e trasformare ogni brano in un prodotto competitivo e professionale.</p>
                        <router-link :to="`selections`" class="btn btn-about">Ascolta i miei lavori</router-link>
                    </div>

                <ModalBtn :where="'ModalContact'" />
                </div>
                <ModalContactMe />
        </section>
</template>
<style scoped lang="scss">
.section-txt{
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    p{
        margin: 0;
    }

    .btn-about{
        width: fit-content;
        min-width: 16rem;
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

.section-txt-last{
    align-items: flex-start;
}

@media only screen and (max-width: 960px) {
    .section-txt{
        gap: 1.25rem;

        .btn-about{
            width: 100%;
            min-width: 0;
            text-align: center;
        }
    }
}
</style>
