import { defineStore } from 'pinia';
//import axios from 'axios';
import { ref, watch } from 'vue';
import { useRouter } from "vue-router";

import { create, search, remove, update, get, getLimited, getNext, getPrev } from "@/api/crud";


export const useAuthorStore = defineStore('AuthorStore', () => {
    const router = useRouter();
    const Author = ref({});
    const Authors = ref([]);
    const AuthorsLimit = ref(); // we'll use for create a call with pagination in dashboard: Number element in page / Authors.length = Number of page to scroll
    const nextAuthors = ref();
    const prevAuthors = ref();

    const numberOfAuthors = () =>{ 
      return Authors.value.length
    }
    const createAuthor = async (newAuthor) => {
      return await create('Authors', newAuthor)
      .then(() =>{
        Authors.value.push(newAuthor);
        alert('Well done! You have create this Author!')
        router.push('/dashboard');
      })
      .catch(error =>{
        throw error;
      }); 
    }
    const deleteAuthor = async (thisAuthor) =>{
      return await remove('Authors', thisAuthor)
      .then(async () =>{
        console.log(Authors.value,'this is Authors value PRIMA FILTER')
        const updateAuthors = await Authors.value.filter((x) => {
          console.log(Authors.value,'this is Authors value DURANTE FILTER')
          return x.thisAuthor !== thisAuthor
        })
        console.log(updateAuthors,'this is updateAuthors')
        Authors.value = updateAuthors
        alert('Well done! You have delete this Author!')
      })
      .catch(error =>{
        throw error;
      }); 
    }
    //update = (collectionRef, id, item)
    const updateAuthor = async (id, editAuthor) =>{
      return await update('Authors', id, editAuthor)
      .then(response => {
        console.log('questo è editAuthor: ',editAuthor)
        alert('Well done! You have edit this Author!')
      })
      .catch((error) => {
        throw error;
      })
    }
    const getAuthor = async (id) =>{
      const getId = await Authors.value.filter((x) => {
        return x.id === id 
      })
      let item = JSON.parse(JSON.stringify(getId))
      return item[0]
    }

    const getAuthorById = (id) => {
      const _author = Authors.value.find((author) => author.id === id);
      return JSON.parse(JSON.stringify(_author));
    }

    const getAllAuthors = async (attr) =>{
      return await search("Authors", attr) 
      .then(response => {
        Authors.value = response
        console.log(Authors.value, 'dati-AUTHORS storati')
      })
      .catch((error) => {
        throw error;
      })
    }
    const getLimitedAuthors = async (perPage, attr) =>{
      return await getLimited('Authors',perPage, attr) 
      .then(response => {
        nextAuthors.value = response.lastVisible
        prevAuthors.value = response.firstVisible
        AuthorsLimit.value = response.arrLimited
      })
      .catch((error) => {
        throw error;
      })
    }
    const getNextAuthors = async (perPage,attr,lastAuthor) =>{
      return await getNext('Authors',perPage,attr,lastAuthor)
      .then(response => {
        nextAuthors.value = response.lastVisible
        console.log('questo è next PINIA: ',nextAuthors.value)
        prevAuthors.value = response.firstVisible
        AuthorsLimit.value = response.arrLimited
      })
      .catch((error) => {
        throw error;
      })
    }
    const getPrevAuthors = async (perPage,attr,prevAuthor) =>{
      return await getPrev('Authors',perPage,attr,prevAuthor)
      .then(response => {
        nextAuthors.value = response.lastVisible
        prevAuthors.value = response.firstVisible
        AuthorsLimit.value = response.arrLimited
      })
      .catch((error) => {
        throw error;
      })
    }
  return {
    Authors,
    Author,
    AuthorsLimit,
    nextAuthors,
    prevAuthors,
    numberOfAuthors,
    createAuthor,
    deleteAuthor,
    updateAuthor,
    getAuthor,
    getAllAuthors,
    getLimitedAuthors,
    getNextAuthors,
    getPrevAuthors,
    getAuthorById,
  }
});