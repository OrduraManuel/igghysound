<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const dismissModal = ref()

const userData = ref({
  name: '',
  category: '',
  project: ''
})
const handleForm = async () => {
  console.log('parte handleSubmit')
    // Sostituisci 'ENDPOINT_DEL_SERVIZIO' con l'endpoint fornito dal servizio
    await fetch('https://formspree.io/f/xeqyzaaa', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({
      name: userData.value.name,
      category: userData.value.category,
      project: userData.value.project,
    }),
    })
    .then(()=>{
      alert('Complimenti '+ userData.value.name +', il tuo messaggio è stato inviato!')
      dismissModal.value.click()
    }
);
/*
      await login(email, password)
        if(!error.value) {
          alert('Welcome: '+ email +' you are back!')
        setTimeout(()=>{
        },3000)
        router.push('/')
      }else{
        alert('Email or Pswd error ',  error)
      }
      */
}

</script>
<template>
<Teleport to="Body">
    <div class="modal fade " id="ModalContact" tabindex="-1" aria-labelledby="ModalContact" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="ModalContact">Parlami di te</h5>
            <a  data-bs-dismiss="modal" aria-label="Close" ref="dismissModal">
              <i class="fal fa-2x fa-window-close"></i>
            </a>
        </div>
        <div class="modal-body">
            <form @submit.prevent="handleForm">
              <div class="containerInput">
                <div class="input NameBox">
                    <input type="text" name="" required="" v-model="userData.name">
                    <label>Nome</label>  
                </div>
                <div class="input CategoryBox">
                    <input type="text" name="" required="" v-model="userData.category">
                    <label>Genere musicale</label>  
                </div>
              </div>
                <div class="input CategoryBox">
                    <textarea rows="5" cols="80" name="talkToYou"  v-model="userData.project">
                    </textarea>
                    <label>Desrivi il tuo progetto</label> 
                </div>
                <button href="#"  type="submit" >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Invia
                </button>
            </form>
        </div>
        </div>
    </div>
    </div>
</Teleport>
</template>
<style lang="scss" scoped>
.modal{
  backdrop-filter: blur(2px);
}
.modal-content{
  background: rgba(255,255,255,.3);//var(--textDark);
  border: var(--border);
  backdrop-filter: blur(5px);
  .card-header{
    color:var(--textLight);
    i{
      
      color: var(--textLight);

    }
  }
}
form{
    background: black;
    button{
      outline: none;
      border: none;
      border-radius: 0;
      position: relative;
      display: inline-block;
      padding: 10px 20px;
      color: var(--brandPrimary);
      font-size: 16px;
      text-decoration: none;
      text-transform: uppercase;
      overflow: hidden;
      transition: .5s;
      margin-top: 40px;
      letter-spacing: 4px;
      background: transparent;
        &:hover{
            background: var(--brandPrimary);
            color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 5px var(--brandPrimary),
                        0 0 25px var(--brandPrimary),
                        0 0 50px var(--brandPrimary),
                        0 0 100px var(--brandPrimary);
            }
        span{
            position: absolute;
            display: block;
            &:nth-child(1){
                top: 0;
                left: -100%;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--brandPrimary));
                animation: btn-anim1 1s linear infinite;
            }
            &:nth-child(2) {
                top: -100%;
                right: 0;
                width: 2px;
                height: 100%;
                background: linear-gradient(180deg, transparent, var(--brandPrimary));
                animation: btn-anim2 1s linear infinite;
                animation-delay: .25s
            }
            &:nth-child(3) {
                bottom: 0;
                right: -100%;
                width: 100%;
                height: 2px;
                background: linear-gradient(270deg, transparent, var(--brandPrimary));
                animation: btn-anim3 1s linear infinite;
                animation-delay: .5s
            }
            &:nth-child(4) {
                bottom: -100%;
                left: 0;
                width: 2px;
                height: 100%;
                background: linear-gradient(360deg, transparent, var(--brandPrimary));
                animation: btn-anim4 1s linear infinite;
                animation-delay: .75s
                }
        }    
    }
}
.containerInput{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.input{
    position: relative;
    margin: 1% 2%;
    input,textarea {
        width: 100%;
        padding: 10px 0;
        font-size: 16px;
        color: #fff;
        margin-bottom: 30px;
        border: none;
        border-bottom: 1px solid #fff;
        outline: none;
        background: transparent;
        &:focus,&:valid{
            ~ label{
                top: -20px;
                left: 0;
                color: var(--textLight);
                font-size: 12px;
            }
        }
    }
    label {
        position: absolute;
        top:0;
        left: 0;
        padding: 10px 0;
        font-size: 16px;
        color: #fff;
        pointer-events: none;
        transition: .5s;
    }    
}
.NameBox{
    &input{


    }
}
@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,100% {
    left: 100%;
  }
}
@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,100% {
    top: 100%;
  }
}
@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,100% {
    right: 100%;
  }
}
@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,100% {
    bottom: 100%;
  }
}
</style>
