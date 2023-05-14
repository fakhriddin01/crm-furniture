import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'

export const contactStore  = defineStore('contact', ()=>{
    
    const state = reactive({
        list: [],
        load: true,
        errorMessage: "",

    })

    

    const CANCEL = (tel)=>{
        state.list.forEach(el => {
            if(el.tel == tel){
                el.status=false;
                console.log(el.status);
            }
        })
    }


    return { CANCEL, state}
})