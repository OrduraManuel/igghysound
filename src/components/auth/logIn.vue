<script setup>
import useLogin from '@/auth/useLogin.js'
// import { inject } from 'vue'
import { useRouter } from 'vue-router'
//import { reactive } from 'vue'

  let  email =  'Book@Stock.it'
  let  password = 'Book@Stock.it'

    //let { GStore }  = reactive({FlashMessage: ''})

  const router = useRouter()


  async function handleSubmit(){
      const { login, error } = useLogin()
      await login(email, password)
        if(!error.value) {
          alert('Welcome: '+ email +' you are back!')
            //this.GStore.FlashMessage = 'you re a successfully logged ' + email
        setTimeout(()=>{
            //this.GStore.FlashMessage = ''
        },3000)
        router.push('/')
      }else{
        alert('Email or Pswd error ',  error)
       
      }
    }
  
  
</script>

<template>
    <div class="cardAuth">
      <form @submit.prevent="handleSubmit">
        <div class="card-header">
          <h2>Login</h2>
        </div>
        <div class="card-body">
          <label for="email">Email:</label>
          <input type="email" name="email" v-model="email" required>
  
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="password" required>
        </div>
        <div class="card-footer">
          <button class="btn btnAuth">Login</button>
        </div>
        <div class="card-error" v-if="error">
          {{ error }}
        </div>      
      </form>
    </div>
  
  </template>
  
