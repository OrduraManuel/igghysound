<script setup >
import { ref } from 'vue'

//import { remove, update, search } from "@/api/crud";

let props = defineProps({
    thisBook: Object,
    modalActive: Boolean
    })
//let emit = defineEmits()
const close = () => {
    props.modalActive.value = !props.modalActive.value
    emit(false);
};
function closing(){
    props.modalActive = false
    console.log(props.modalActive,'questaè la props')
    let giorgio = document.getElementById('modal')
    console.log(giorgio,'questa è modal')
    giorgio.classList.add('d-none')
    giorgio.classList.remove('show d-block')
    console.log(giorgio,'questa è modal')
    //giorgio.style.display = 'none'
}

//const closeModal = ref(false)
//const editModal = ref([editBook])

let places = ref([])

async function  searchHandler() {
    places.value = await search("places");
}
   
    const newNumber = ref('')    
    const newTitle = ref('')
    const newAuthor = ref('')
    const newIsFav = ref('')
    const newIsRead = ref('')
    const newLocal = ref('')
    const newNotes = ref('')

const editBook = ref({
    number: newNumber.value,
    title: newTitle.value,
    author: newAuthor.value,
    isFav: newIsFav.value,
    isRead: newIsRead.value,
    local: newLocal.value,
    notes: newNotes.value,
    
})


// update = (collectionRef, id, item)




</script>
<template >
<Teleport to="Body">
    <!--:class="{ show: show, 'd-block': show }"-->
    <div class="modal fade" 
    id="modal"
    :class="{ 'd-none': !modalActive, 'show d-block': modalActive }">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEditLabel">{{props.thisBook.title}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closing()"  ></button> <!--@close="close"-->
                </div>
                <div class="modal-body">
                    <div class="containerFirst">
                        <div class="label">
                        <label for="title">Book ID:</label>
                        <input type="text" name="bumber" v-model="newNumber"  :placeholder="props.thisBook.number" required>
                        <label for="title">Book title:</label>
                        <input type="text" name="title" v-model="newTitle"  :placeholder="props.thisBook.title" required>
                        <label for="title py-3">Book author:</label>
                        <input type="text" name="author" v-model="newAuthor" :placeholder="props.thisBook.author" required>
                        </div>
                    </div>
                    <div class="containerSecond my-4">
                        <div class="label">
                            <label for="title">Where is?</label>
                            <select v-model="newLocal" id="isPlace">
                            <option disabled value="">props.thisBook.local</option>
                            <option v-for="place in places" :value="place.id" :key="place.id">
                                {{place.local}}
                            </option>  
                            </select>
                            <label for="title">Get notes?</label>
                            <textarea rows="" cols="40" name="notes" v-model="newNotes" :placeholder="props.thisBook.notes">
                            </textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @close="false" >Close</button>
                    <div class="action">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" >Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Teleport>
</template>
<style lang="scss" scoped>
.modal-footer{
    display: flex;
    justify-content: space-between;
    .action{
        display: flex;
        justify-content: end;
    }

}
</style>