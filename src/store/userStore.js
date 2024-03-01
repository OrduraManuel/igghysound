import { defineStore } from 'pinia';
//import axios from 'axios';
import { ref } from 'vue';

import getUser from '@/auth/getUser';
 
export const useUserStore = defineStore('userStore', () =>{
  const User = ref({});

  //actions
  const currentUser = () => {
    return getUser()
    .then((response) =>{
      item = response.data;
      this.User.push(item);
    })
    .catch(error =>{
      throw error;
    });
  };
  return {
    User,
    currentUser
  };
});

