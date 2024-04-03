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
          <h4>Login to Furspace</h4>
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
            label="Login"
            size="15px"
          />
          <!-- <div class="spacer"></div> -->
          <!-- <q-btn
            @click="signUpWithGoogle"
            unelevated
            rounded
            class="google-btn"
            color="primary"
            label="Sign Up With Google"
          /> -->
        </div>
        <div class="errorMessage">
          <p v-if="errMsg">{{ errMsg }}</p>
        </div>
        <!-- Link to sign-up page -->
        <div class="signup-link">
          <router-link to="/signup"
            >Don't have an account? Sign up here</router-link
          >
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import LogoSvg from "../assets/white on purple.svg";
import { useRouter } from "vue-router";
import router from "src/router";

export default {
  name: "PageLogin",
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
      errMsg: "",
    };
  },
  methods: {
    async signup() {
      console.log("Verifying Firebase initialization...");
      if (!getApps().length) {
        initializeApp(this.firebaseConfig);
      }

      try {
        const auth = getAuth();
        const data = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        console.log("Login successful!");
        this.$router.push("/home"); // Redirect to home page on successful login
      } catch (error) {
        console.error("Login error:", error);
        switch (error.code) {
          case "auth/invalid-email":
            this.errMsg = "Please enter a valid email";
            break;
          case "auth/user-not-found":
            this.errMsg = "No account was found with that email";
            break;
          case "auth/wrong-password":
            this.errMsg = "The password you have entered is incorrect";
            break;
          default:
            this.errMsg = "An error occurred during login. Please try again.";
        }
      }
    },
    created() {
      console.log("Initializing Firebase...");
      initializeApp(this.firebaseConfig);
    },
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

.errorMessage
  text-align: center
  color: red
  font-weight: bold
  font-size: 20px
  padding-top: 30px

.signup-link
  display: flex
  justify-content: center
  color: $primary
  padding-top: 10px

.head
  color: $primary
  font-weight: bold
  font-size: 20px
  display: flex
  justify-content: center
</style>
