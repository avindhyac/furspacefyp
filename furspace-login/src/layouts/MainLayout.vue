<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary text-white">
      <q-toolbar class="q-toolbar-home constrain">
        <q-btn
          flat
          to="/"
          round
          color="white"
          icon="fa-solid fa-house"
          class="large-screen-only"
        />
        <q-separator vertical inset spaced class="large-screen-only" />
        <div class="svg-container">
          <img :src="LogoSvg" to="/" />
        </div>
        <q-btn
          flat
          to="/camera"
          round
          color="white"
          icon="fa-solid fa-camera"
          class="large-screen-only"
        />
        <!-- <q-btn flat round dense icon="menu" /> -->
      </q-toolbar>
    </q-header>
    <q-footer bordered class="bg-white small-screen-only">
      <q-tabs
        class="text-grey-5"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/home" icon="fa-solid fa-house" />
        <q-route-tab to="/camera" icon="fa-solid fa-camera" />
        <q-route-tab to="/profile" icon="fa-solid fa-user" />
      </q-tabs>
    </q-footer>
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import LogoSvg from "../assets/white on purple.svg";

defineOptions({
  name: "MainLayout",
});
</script>

<style lang="sass">
.svg-container
  width: 175px
  height: 45px

.q-toolbar-home
  display: flex
  justify-content: space-between
  align-items: center
  @media (min-width: $breakpoint-sm-min)
    height: 60px
  @media (max-width: $breakpoint-xs-max)
    justify-content: center
  .q-btn
    padding-top: 10px

.q-toolbar-home .q-btn.large-screen-only:last-child
  margin-left: auto

.q-footer
  .q-tab__icon
    font-size:23px
  padding: 5px
</style>
