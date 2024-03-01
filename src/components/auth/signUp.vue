<script setup>
import useSignup from '@/auth/useSignUp'
import { inject, ref } from 'vue'

let email = ''
let password = ''

const GStore = ref()

    async function handleSubmit(){
      const { signup, error } = useSignup()
      await signup(this.email, this.password)
      if (!error.value) {
        GStore.FlashMessage = 'youre a successfully signup' + this.email
        inject(GStore)
        setTimeout(()=>{
          GStore.FlashMessage = ''
        },3000)
        this.$router.push('/')
      }else{
        error
      }
    }
  
</script>
<template>
    <div class="cardAuth">
      <form @submit.prevent="handleSubmit">
        <div class="card-header">
          <h2>Sign up</h2>
        </div>
        <div class="card-body">
          <label for="email">Email:</label>
          <input type="email" name="email" v-model="email" required>
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="password" required>
        </div>
        <div class="card-footer">
          <button class="btn btnAuth">Sign up</button>
        </div>
        <div class="card-error" v-if="error">
          {{ error }}
        </div> 
      </form>
    </div>
</template>