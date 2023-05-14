<script setup>
import {ref, computed, reactive} from 'vue'
import { useAuth } from '../../service/auth';
import {useRouter} from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();

const input = reactive({
  login: "",
  password: ""
})

const loginUser = ()=> {
  const user = {
    login: input.login,
    password: input.password
  }
  useAuth(user).then((res)=>{
    localStorage.setItem('token', res?.data?.token);
    localStorage.setItem('role', res?.data?.staff?.role);
    router.push({name: 'dashboard'});
    toast.success("Welcome to the system", {autoClose: 500})
  }).catch((error)=>{
    toast.error(error.message)
  })
}

</script>

<template>
  <div class="p-3">
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
       
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Sign in
                  </h1>
                  <form class="space-y-4 md:space-y-6" @submit.prevent="loginUser">
                      <div>
                          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Login</label>
                          <input v-model="input.login" type="text" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Login" required="">
                      </div>
                      <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                          <input v-model="input.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                      </div>
                  
                      <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign in</button>
                    
                  </form>
              </div>
          </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
