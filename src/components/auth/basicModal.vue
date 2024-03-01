<script setup>
import { ref } from 'vue';
let props = defineProps({
	thisTrack: Object,
});
// import loader from "@/components/loader.vue";


//import { search } from "@/api/crud";
/*
    let places = ref([])

    onMounted(() => {
        searchHandler()
    })
    async function  searchHandler() {
            places.value = await search("places");
        }
        */
const newNumber = ref('');
const newTitle = ref('');
const newAuthor = ref('');
const newIsFav = ref('');
const newImage = ref('');
const newSrc = ref('');

// eslint-disable-next-line no-unused-vars
const editTrack = ref({
	Number: newNumber.value,
	Title: newTitle.value,
	Author: newAuthor.value,
	isFav: newIsFav.value,
	Img: newImage.value,
	Src: newSrc.value,
});

const emit = defineEmits(['editTrack']);

const handleEdit = () => {
	emit('editTrack');
};
function closeModal(){
	const myModal = document.getElementById('exampleModal');
	myModal.classList.remove('show', 'd-block');

}

</script>
<template >
    <Teleport to="Body">
        <div class="modal fade" 
        id="exampleModal" 
        tabindex="-1" 
        aria-labelledby="exampleModalLabel" 
        aria-hidden="true" 
        v-if="props.thisTrack">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{ props.thisTrack.title }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <div class="label">
                        <label for="title">Track ID:</label>
                            <input type="text" name="number" v-model="newNumber" :placeholder="props.thisTrack.Number" required>
                        <label for="title">Track title:</label>
                            <input type="text" name="title" v-model="newTitle"  :placeholder="props.thisTrack.Title" required>
                        <label for="title py-3">Track author:</label>
                            <input type="text" name="author" v-model="newAuthor" :placeholder="props.thisTrack.Author" required>
                            <label for="title">It image?</label>

                            <label for="title">Get Link?</label>
                                <textarea rows="" cols="40" name="notes" v-model="newSrc" :placeholder="props.thisTrack.Src">
                                </textarea>   
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="handleEdit">Save changes</button>
                </div>
            </div>
        </div>
        </div>
    </Teleport>
</template>
