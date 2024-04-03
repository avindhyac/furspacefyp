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
        :disable="imageCaptured"
        round
        color="primary"
        icon="fa-solid fa-camera"
        size="lg"
      />
      <div class="q-ma-md"><q-separator inset /></div>

      <div class="row justify-center q-ma-md">
        <q-file
          @input="handleFileUpload"
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
        label="Caption *"
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
    <div class="row justify-center q-ma-md">
      <q-select
        v-model="selectedEmotion"
        :options="emotionOptions"
        label="Emotion *"
        filled
        :disable="!imageCaptured"
        class="col col-sm-6"
      />
    </div>
    <div class="row justify-center q-mt-lg">
      <q-btn
        @click="addPost"
        :disable="!post.caption || !post.img"
        unelevated
        rounded
        color="primary"
        label="Post Image"
      />
    </div>
  </q-page>
</template>

<script>
import { uid } from "quasar";
import * as tf from "@tensorflow/tfjs";
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
        emotion: "",
      },
      hasCameraSupport: true,
      imageCaptured: false,
      imageUpload: [],
      locationLoading: false,
      selectedEmotion: "", // emotion from select to override predicted emotion
      emotionOptions: ["Angry", "Happy", "Sad", "Relaxed"],
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
      console.log("Image captured and going to classify");
      this.classifyImage(canvas);
      this.post.img = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },

    async classifyImage(canvas) {
      try {
        const classLabels = ["Angry", "Happy", "Relaxed", "Sad"];

        // Load model from backend endpoint
        const model = await tf.loadLayersModel(
          "http://localhost:2000/model/model.json" // Assuming your backend endpoint is '/model'
        );

        // Preprocess image
        const imageData = this.preprocessImage(canvas);

        // Perform inference
        const predictions = await model.predict(imageData);

        // Extract values from the predictions Tensor
        const predictionsArray = await predictions.data(); // For asynchronous execution

        // Find the index of the highest probability score
        const maxIndex = predictionsArray.indexOf(
          Math.max(...predictionsArray)
        );

        // Get the predicted class label
        const predictedClass = classLabels[maxIndex];

        console.log("Predicted class:", predictedClass);

        if (predictedClass && this.emotionOptions.includes(predictedClass)) {
          this.selectedEmotion = predictedClass;
          this.post.emotion = predictedClass;
        }

        // Log the predictions
        console.log("Predictions: ", predictionsArray);

        return this.post.emotion;

        // You can further process the predictionsArray here
      } catch (error) {
        console.error("Error during classification:", error);
      }
    },

    preprocessImage(canvas) {
      const tensor = tf.browser.fromPixels(canvas);

      // Resize the image to [224, 224]
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);

      // Expand the dimensions to match the model's input shape
      const expanded = resized.expandDims(0);

      // Normalize the pixel values to the range [0, 1]
      const normalized = expanded.toFloat().div(tf.scalar(255));

      return normalized;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];

      // Check if a file is selected
      if (!file) {
        return;
      }

      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create a new image element
        const img = new Image();
        img.onload = () => {
          // Draw the image onto the canvas
          const canvas = this.$refs.canvas;
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Set the captured image flag
          this.imageCaptured = true;

          // Set the img property of the post object
          this.post.img = this.dataURItoBlob(canvas.toDataURL());

          // Perform image classification
          this.classifyImage(canvas);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
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
    // updatePostEmotion() {
    //   if (
    //     this.selectedEmotion &&
    //     this.emotionOptions.includes(this.selectedEmotion)
    //   ) {
    //     console.log("Emotion overridden to: ", this.selectedEmotion);
    //     this.post.emotion = this.selectedEmotion;
    //   }
    // },
    async addPost() {
      this.$q.loading.show({
        spinnerColor: "primary",
        spinnerSize: 140,
        backgroundColor: "black",
        message: "Creating your post, hang on a moment",
      });

      if (this.post.img) {
        // Capture image from canvas
        let canvas = this.$refs.canvas;

        // Perform image classification
        // predictedClass = await this.classifyImage(canvas);
        console.log("Selected Emotion:", this.selectedEmotion);
        this.post.emotion = this.selectedEmotion;
        console.log("CLASS WHEN POSTING: ", this.post.emotion);
      }

      let formData = new FormData();
      formData.append("id", this.post.id);
      formData.append("caption", this.post.caption);
      formData.append("location", this.post.location);
      formData.append("date", this.post.date);
      formData.append("file", this.post.img, this.post.id + ".png");

      // Append predicted class to the form data
      formData.append("predictedClass", this.post.emotion);

      this.$axios
        .post(`${process.env.API}/createPost`, formData)
        .then((response) => {
          console.log("RESPONSE", response);
          this.$router.push("/");
          this.$q.notify({
            message: "Post created",
            icon: "fa-solid fa-check",
            color: "primary",
            textColor: "white",
          });
          this.$q.loading.hide();
        })
        .catch((error) => {
          console.log("ERROR", error);
          this.$q.dialog({
            title: "Error",
            message: "We couldn't create your post right now 😞",
          });
          this.$q.loading.hide();
        });
    },

    getLocation() {
      this.locationLoading = true;
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
        title: "Error",
        message: "We couldn't find your location 😵‍💫",
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
