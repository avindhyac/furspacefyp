<template>
  <q-page class="constrain-cam q-pa-md">
    <div class="camera-frame q-qa-md">
      <video v-show="!imageCaptured" class="full-width" autoplay ref="video" />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="hasCameraSupport"
        @click="captureImage"
        round
        color="primary"
        icon="fa-solid fa-camera"
        size="lg"
      />
      <div class="q-ma-md"><q-separator inset /></div>

      <div class="row justify-center q-ma-md">
        <q-file
          @input="captureImageFallback"
          label-color="deep-purple-1"
          bg-color="primary"
          filled
          v-model="imageUpload"
          label="Choose from library"
          accept="image/*"
        >
          <template v-slot:prepend>
            <q-icon name="fa solid fa-paperclip" color="deep-purple-1" />
          </template>
        </q-file>
      </div>
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
        :loading="locationLoading"
        v-model="post.location"
        label="Location"
        class="col col-sm-6"
        dense
      >
        <template v-slot:append>
          <q-btn
            v-if="!locationLoading && isLocationSupported"
            @click="getLocation"
            round
            dense
            flat
            icon="fa-solid fa-location-dot"
          />
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
require("md-gum-polyfill");
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
      hasCameraSupport: true,
      imageCaptured: false,
      imageUpload: [],
      locationLoading: false,
    };
  },
  computed: {
    isLocationSupported() {
      if ("geolocation" in navigator) return true;
      else return false;
    },
  },
  methods: {
    initCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
        })
        .catch((error) => {
          this.hasCameraSupport = false;
        });
    },
    captureImage() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      // this.post.photo = canvas.toDataURL();
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },

    captureImageFallback(file) {
      this.post.photo = file;
      const reader = new FileReader();
      let canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      // Upload image to canvas
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },

    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },

    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      let byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      let ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      let ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      let blob = new Blob([ab], { type: mimeString });
      return blob;
    },

    getLocation() {
      this.locationLoading = true;
      console.log("getLocation");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (err) => {
          this.locationError();
        },
        { timeout: 7000 }
      );
    },
    getCityAndCountry(position) {
      let key = "331807169281515298762x66764";
      let apiURL = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1&auth=${key}`;
      this.$axios
        .get(apiURL)
        .then((result) => {
          this.locationSuccess(result);
        })
        .catch((err) => {
          this.locationError();
        });
    },
    locationSuccess(result) {
      this.post.location = result.data.city;
      if (result.data.country) {
        this.post.location += `, ${result.data.country}`;
      }
      this.locationLoading = false;
    },

    locationError() {
      this.$q.dialog({
        title: "Alert",
        message: "Some message",
      });
      this.locationLoading = false;
    },
  },

  mounted() {
    this.initCamera();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
      console.log("camera ");
    }
  },
};
</script>

<style lang="sass">
.camera-frame
  border: 2px solid $primary
  border-radius: 10px
  padding: 5px
</style>
