<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import { productStore } from '../../stores/products/productStore';
import { toast } from 'vue3-toastify';
import {productTypeStore} from '../../stores/products/productType'
import {useRouter} from 'vue-router'
import {useProduct} from '../../service/product'
import { useCategory } from '../../service/category';

const router = useRouter()
const types = productTypeStore();
const store = productStore();

const modal = ref(false);
const toggleModal = () => modal.value = !modal.value

const LIST = computed(()=> store.state.list)
const TYPE_LIST = computed(()=> types.state.list)


//  Action button +++++++++++++++++++++++
const action = ref('');
const toggleAction = (id) =>{
    if(action.value == id){
        action.value = ''
    }else{
        action.value = id
    }
};
const cancelToggel= ()=>{
    action.value=''
};

const deleteProduct = (id) => {
    useProduct.delete(id).then((res)=>{
        if(res.status == 200){
            toast.info('product deleted');
            listUpdate();
        }else{
            toast.info(res.status)
        }

    }).catch((error)=>{
        toast.error(error.response.data.message)
    })
}
//  Action button ---------------------------------



// Filter by type +++++++++++++++++++++++++

const type = ref('');
const filterByRole = ()=>{
    if(type.value == ''){
        listUpdate();
    } else{
        useProduct.listByRole(type.value).then((res)=>{
            store.state.list = res.data.products
            pagination.total_page = res.data.total_pages
            pagination.current_page = res.data.current_page
            pagination.total_number = res.data.allProducts
            pagination.page = pagination.current_page
            if(pagination.page==1){
                pagination.previous = true
            }else{
                pagination.previous = false

            }
            if(pagination.page == pagination.total_page){
                pagination.next = true
            }else{
                pagination.next = false
            }
            type.value=''
        }).catch((error)=>{
            toast.error(error.response.data.message)
        })
    }
}




// Filter by type --------------------------




// Search input +++++++++++++++++++++++++

const search = reactive({
    input: '',

})

const filterSearch = () =>{
    if(search.input == ''){
        listUpdate();
    }else{
        
            useProduct.listByName(search.input).then((res)=>{
                store.state.list = res.data.products
                pagination.total_page = res.data.total_pages
                pagination.current_page = res.data.current_page
                pagination.total_number = res.data.allProducts
                pagination.page = pagination.current_page
                if(pagination.page==1){
                    pagination.previous = true
                }else{
                    pagination.previous = false

                }
                if(pagination.page == pagination.total_page){
                    pagination.next = true
                }else{
                    pagination.next = false
                }
            }).catch((error)=>{
                if(error.message == 'Request failed with status code 401' || error.message == 'token expired' || error.message == 'token not found'){
                    router.push({name: 'login'})
                }
                else{
                    toast.error('error');
                }
                console.log(error.response.data.message);
            })
  
    }

}

//  Search input end -----------------------------



const pagination = reactive({
    total_page: 1,
    current_page: 1,
    total_number: 1,
    limit: 10,
    page: 1,
    previous: false,
    next: false,
})

const listUpdate = () => {
    useProduct.list().then((res)=>{
        store.state.list = res.data.products
        pagination.total_page = res.data.total_pages
        pagination.current_page = res.data.current_page
        pagination.total_number = res.data.allProducts
        pagination.page = +pagination.current_page;
        if(pagination.page==1){
            pagination.previous = true
        }else{
            pagination.previous = false
        }
        if(pagination.page == pagination.total_page){
            pagination.next = true
        }else{
            pagination.next = false
        }
    }).catch((error)=>{
        if(error.message == 'Request failed with status code 401' || error.message == 'token expired' || error.message == 'token not found'){
            router.push({name: 'login'})
            toast.error('Token expired');
        }
        else{
            toast.error('error');
        }
        console.log(error.message);
    })
}


const productInfo = reactive({
    name: '',
    price: '',
    description:'',
    type: '',
    files: ''
})

const selectedFile = (event) => {
      productInfo.files = event.target.files[0]
}

const addProduct= async ()=>{

    let formdata = new FormData();
    formdata.append('file', productInfo.files)
    formdata.append('name', productInfo.name)
    formdata.append('price', productInfo.price)
    formdata.append('category_id', productInfo.type)

    // const category = await useProduct.getCategoryId(productInfo.type);

    // const product = {
    //     name: productInfo.name,
    //     price: productInfo.price,
    //     type: productInfo.type,
    //     description: productInfo.description,
    //     category_id: category.data._id
    // }

    useProduct.create(formdata).then((res)=>{
        if(res.status == 201){
            toast.success('successfully added product !', {autoClose: 1500, theme: 'dark', pauseOnHover: false})
            productInfo.name=''
            productInfo.price=''
            productInfo.type=''
            productInfo.description=''
            productInfo.files=''
            toggleModal()
            listUpdate();
        }
    }).catch(()=>{
        if(error.message == 'token expired' || error.message == 'token not found'){
            router.push('/login')
        }
        else{
            toast.error();
        }
        console.log(error.message);
    })
    

}

onMounted(()=>{
    useCategory.list().then((res)=>{
        types.state.list = res.data
    })
    listUpdate();
})
</script>

<template>
 
  
  <div class="p-3">
    <h2 class="uppercase dark:text-white text-gray-900">Mahsulotlar</h2>


      <!-- -------------------------modal------------------------------------- -->

    <!-- Modal toggle -->
    

    <!-- Main modal -->
    <div  tabindex="-1" aria-hidden="true" class="overflow-y-auto flex bg-[rgba(0,0,0,0.4)] overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full" :class="modal ? '' : 'hidden'">
        
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Yangi mahsulot qo'shish
                    </h3>
                    <button @click='toggleModal' type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form @submit.prevent="addProduct($event)">
                    <div class="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mahsulot nomi</label>
                            <input v-model="productInfo.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mahsulot nomini kiriting" required="">
                        </div>
                        <div>
                            <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mahsulot rasmi</label>
                            <input @change="selectedFile($event)" type="file" accept=".jpg , .png" name="brand" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mahsulot rasmini kiriting" >
                        </div>
                        <div> 
                            <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mahsulot narxi</label>
                            <input  v-model="productInfo.price" type="text" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mahsulot narxini kiriting" required="">
                        </div>
                        <div>
                            <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mahsulot turi</label>
                            <select  v-model="productInfo.type" id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected="" disabled>Mahsulot turini tanlang </option>
                                <option v-for="el in TYPE_LIST" :key="el.index" :value="el._id">{{ el.name }}</option>
                            </select>
                        </div>
                       
                    
                    </div>
                    <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Mahsulot qo'shish
                    </button>
                </form>
            </div>
        </div>
    </div>
    <!-- -------------------------end of modal------------------------------------- -->


    <!-- ------------------------table-------------------------------------------- -->
    <section class="dark:bg-gray-900 p-0 sm:p-5 md:p-0 md:py-4">
    <div class="w-full max-w-screen-xl px-0 lg:p-0">
        <!-- Start coding here -->
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div class="w-full md:w-1/2">
                    <form class="flex items-center">
                        <label for="simple-search" class="sr-only">Qidiruv</label>
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input @input="filterSearch" v-model="search.input" type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Qidiruv" required="">
                        </div>
                    </form>
                </div>
                <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button @click="toggleModal" type="button" class="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        Mahsulot qo'shish
                    </button>
                    <div class="flex items-center space-x-3 w-full md:w-auto border p-1 bg-slate-300 rounded-md">
                        <div>
                            <!-- <button @click="toggleDrop" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                                <svg class="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                                Lavozim
                            </button> -->
                            <!-- <div class="z-10  flex w-[110px] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" > -->
                                
                                <select v-model="type" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" >
                                    <option value="" selected class="block w-[110px] py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Turi</option>
                                    <option v-for="el in TYPE_LIST" :key="el.index" :value="el._id"  class="block w-[110px] py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{{ el.name }}</option>
                                </select>
                                
                                <!-- <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                                    <li>
                                        <a class="block w-[110px] py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">SUPERADMIN</a>
                                    </li>
                                    <li>
                                        <a class="block w-[110px] py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ADMIN</a>
                                    </li>
                                    <li>
                                        <a class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">OPERATOR</a>
                                    </li>
                                    <li>
                                        <a class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">CURRIER</a>
                                    </li>
                                </ul> -->
                            
                            <!-- </div> -->
                        </div>
                        <button @click="filterByRole" class="w-full md:w-auto flex items-center justify-center py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-2 text-gray-400" viewbox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                            </svg> -->
                            Saralash
                            <!-- <svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg> -->
                        </button>
                        <!-- <div class="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                            <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Holatni tanlang</h6>
                            <ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                                <li class="flex items-center">
                                    <input id="apple" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label for="apple" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Faol</label>
                                </li>
                                <li class="flex items-center">
                                    <input id="fitbit" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Faol emas</label>
                                </li>
                                
                            </ul>
                        </div> -->
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">Mahsulot nomi</th>
                            <th scope="col" class="px-4 py-3">Mahsulot narxi</th>
                            <th scope="col" class="px-4 py-3">Mahsulot turi</th>
                            <th scope="col" class="px-4 py-3">Qo'shilgan sanasi</th>
                            <th scope="col" class="px-4 py-3">Mahsulot rasmi</th>
                            <th scope="col" class="px-4 py-3 text-center">
                                <span class="s">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(el, index) in LIST" :key="el.index" class="border-b dark:border-gray-700">
                            <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ el.name }}</th>
                            <td class="px-4 py-3">{{el.price}}$</td>
                            <td class="px-4 py-3">{{el.category_id.name}}</td>
                            <td class="px-4 py-3">{{el.createdAt.substring(0, 10)}}</td>
                            <td class="px-4 py-3"><img  :src="el.image" class="rounded-full object-cover w-[42px] h-[42px] border border-dashed" alt=""></td>
                            <td @mouseleave="cancelToggel" class="px-4 py-3 flex flex-col items-center justify-center">
                                <button @click="toggleAction(el._id)"  class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </button>
                                <div v-if="action == el._id" class="z-10 absolute bottom-8 w-22 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" >
                                    <ul class="py-0 text-sm text-gray-700 dark:text-gray-200">
                                   
                                        <li>
                                            <a @click="deleteProduct(el._id)" class="block py-1 px-4 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                     </tbody>
                </table>
            </div>
            <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    
                    <span class="font-semibold text-gray-900 dark:text-white">{{ pagination.total_number }}</span>
                    dan
                    <span class="font-semibold text-gray-900 dark:text-white">{{(pagination.current_page-1)*pagination.limit+1}}-{{ ((pagination.current_page-1)*pagination.limit)+LIST.length}}</span>
                </span>
                <ul class="inline-flex items-stretch -space-x-px">
                    <li>
                        <button @click="listUpdate(+pagination.page-1)" :disabled="pagination.previous" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Previous</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </li>
                    <li v-for="el in pagination.total_page">
                        <button @click="listUpdate(el)" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" :class="(pagination.page === el) ? 'bg-blue-300' : ''"> {{ el }} </button>
                    </li>
                   
                    <li>
                        <button @click="listUpdate(+pagination.page+1)" :disabled="pagination.next" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Next</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    </section>
    <!-- -------------------------end of table------------------------------------- -->


  


  </div>


</template>

<style lang="scss" scoped></style>
