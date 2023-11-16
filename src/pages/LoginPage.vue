<template>
  <div class="w-full h-screen bg-red-500">
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <!-- Title -->
      <div class="absolute top-0 left-0 right-0 text-center mt-24">
        <h2 class="text-5xl font-bold text-gray-800 px-2 mx-auto w-full ">RoboCup Maze Organistaor</h2>
      </div>

      <!-- Login Form -->
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-10 text-gray-800">Login</h2>
        <div class="mb-6">
          <label for="username" class="block mb-2 text-sm text-gray-600">Username</label>
          <input type="text" v-model="username" class="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:border-blue-500" required>
        </div>
        <div class="mb-6">
          <label for="password" class="block mb-2 text-sm text-gray-600">Password</label>
          <input type="password" v-model="password" class="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:border-blue-500" required>
        </div>
        <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="login">Login</button>
      </div>

      <router-link to="/scoreboard">
        <div class="mt-4 text-blue-400 cursor-pointer hover:text-blue-800">
          &gt; Zum Scoreboard &lt;
        </div>
      </router-link>

    </div>
  </div>
</template>

<script setup>
import {API} from "../api.js";
import {ref} from "vue"
import {useRouter} from "vue-router";

const router = useRouter()
const username = ref("");
const password = ref("");

function login() {
  API.axios.post("login", {
    username: username.value,
    password: password.value,
  })
      .then((res) => res.status === 200 && router.push("/")  )
      .catch()
      .finally(() => {
        username.value = ""
        password.value = ""
      })
}
</script>
