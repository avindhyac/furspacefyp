<template>
  <q-layout>
    <q-header class="bg-primary text-white">
      <q-toolbar class="q-toolbar-home constrain">
        <div class="svg-container">
          <img :src="LogoSvg" to="/" />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="constrain q-pa-md">
        <div class="head">
          <h4>Join Furspace Now!</h4>
        </div>
        <div class="inputs">
          <q-input outlined v-model="email" label="Email" type="text" />
          <div class="spacer"></div>
          <q-input
            outlined
            v-model="password"
            label="Password"
            type="password"
          />
        </div>
        <div class="buttons">
          <q-btn
            @click="signup"
            unelevated
            rounded
            color="primary"
            label="Sign Up With Email"
          />
          <div class="spacer"></div>
          <q-btn
            @click="signUpWithGoogle"
            unelevated
            rounded
            class="google-btn"
            color="primary"
            label="Sign Up With Google"
          />
        </div>
        <div class="login-link">
          <router-link to="/">Already have an account? Login here</router-link>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import LogoSvg from "../assets/white on purple.svg";
import { useRouter } from "vue-router";
import router from "src/router";

export default {
  name: "PageSignup",
  data() {
    return {
      firebaseConfig: {
        apiKey: "AIzaSyA3ycX_tDbhnn7UZbNmMfc4ErpuU_GNkCQ",
        authDomain: "furspace-99993.firebaseapp.com",
        projectId: "furspace-99993",
        storageBucket: "furspace-99993.appspot.com",
        messagingSenderId: "700501398555",
        appId: "1:700501398555:web:845fbea444d0f9642814be",
      },
      email: "",
      password: "",
    };
  },
  methods: {
    signup() {
      createUserWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((data) => {
          console.log("User has been signed up successfully!");
          router.push("/");
        })
        .catch((error) => {
          console.log(error.code);
        });
    },
    signUpWithGoogle() {},
  },
  created() {
    initializeApp(this.firebaseConfig); // Initialize Firebase when component is created
  },
};
</script>

<style lang="sass">
.svg-container
  width: 175px
  height: 45px

.q-toolbar-home
  display: flex
  justify-content: space-between
  align-items: center

.buttons
  display: flex
  justify-content: center
  margin-top: 20px

.spacer
  width: 10px
  height: 10px

.google-btn
  background-color: #4285f4
  color: white
  border: none
  text-transform: uppercase
  font-weight: bold
  padding: 10px 20px
  cursor: pointer
  transition: background-color 0.3s
  &:hover
    background-color: #357ae8

.login-link
  display: flex
  justify-content: center
  color: $primary
  padding-top: 35px

.head
  color: $primary
  font-weight: bold
  font-size: 20px
  display: flex
  justify-content: center
</style>
