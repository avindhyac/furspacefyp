<template>
  <q-page class="constrain-cam q-pa-md">
    <div class="camera-frame q-qa-md">
      <img src="https://cdn.quasar.dev/img/parallax2.jpg" class="full-width" />
    </div>
    <div class="text-center q-pa-md">
      <q-btn round color="primary" icon="fa-solid fa-camera" size="lg" />
    </div>
    <div class="row justify-center q-ma-md">
      <q-input
        v-model="post.caption"
        label="Caption"
        class="col col-sm-6"
        dense
      />
    </div>
    <div class="row justify-center q-ma-md">
      <q-input
        v-model="post.location"
        label="Location"
        class="col col-sm-6"
        dense
      >
        <template v-slot:append>
          <q-btn round dense flat icon="fa-solid fa-location-dot" />
        </template>
      </q-input>
    </div>
    <div class="row justify-center q-mt-lg">
      <q-btn unelevated rounded color="primary" label="Post Image" />
    </div>
  </q-page>
</template>

<script>
import { uid } from "quasar";
export default {
  name: "PageCamera",
  data() {
    return {
      post: {
        id: uid(),
        caption: "",
        location: "",
        img: null,
        date: Date.now(),
      },
    };
  },
};
</script>

<style lang="sass">
.camera-frame
  border: 2px solid $primary
  border-radius: 10px
  padding: 5px
</style>
