<script setup>
    import logIn from '@/components/auth/logIn.vue'
    import signUp from '@/components/auth/signUp.vue'
    import toBack from '@/components/toBack.vue'
</script>
<template >
    <section class="firstLog">
        <toBack  where="/"/>
        <div class="row">
            <div class="col-12">
                <logIn class="logIn"/>
                <!--<signUp class="signUp"/>-->
            </div>
        </div>
    </section>
</template>
