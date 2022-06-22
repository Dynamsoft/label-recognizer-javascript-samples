<template>
  <div class="helloWorld">
    <h1>Hello World for Nuxtjs</h1>
    <div id="UIElement">
      <div class="btn-group" v-if="libLoaded">
        <button :style="{marginRight: '10px', backgroundColor: bShowRecognizer ? 'rgb(255,174,55)' : 'white'}" @click="showRecognizer">Video Recognizer</button>
        <button :style="{backgroundColor: bShowImgDecode ? 'rgb(255,174,55)' : 'white'}" @click="showImgDecode">Image Recognizer</button>
      </div>
      <span style="font-size: x-large" v-if="!libLoaded">Loading Library...</span>
      <VideoRecognizer v-if="bShowRecognizer"></VideoRecognizer>
      <ImgRecognizer v-if="bShowImgDecode"></ImgRecognizer>
    </div>
  </div>
</template>

<script>
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import VideoRecognizer from "./VideoRecognizer";
import ImgRecognizer from './ImgRecognizer.vue'

export default {
  name: "HelloWorld",
  components: {
    VideoRecognizer, ImgRecognizer
  },
  data() {
    return {
      libLoaded: false,
      bShowRecognizer: true,
      bShowImgDecode: false
    };
  },
  async mounted() {
    try {
      //Load the library on page load to speed things up.
      await LabelRecognizer.loadWasm();
      this.libLoaded = true;
      this.showRecognizer();
    } catch (ex) {
      let errMsg;
      if (ex.message.includes("network connection error")) {
          errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
      } else {
          errMsg = ex.message||ex;
      }
      console.error(errMsg);
      alert(errMsg);
    }
  },
  methods: {
    showRecognizer() {
      this.bShowRecognizer = true;
      this.bShowImgDecode = false;
    },
    showImgDecode() {
      this.bShowRecognizer = false;
      this.bShowImgDecode = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.helloWorld {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #455a64;
}
h1 {
  font-size: 1.5em;
}
#UIElement {
  margin: 2vmin auto;
  text-align: center;
  font-size: medium;
  height: 40vh;
  width: 80vw;
}
button {
  font-size: 1.5rem;
  margin: 1.5vh 0;
  border: 1px solid black;
  background-color: white;
  color: black;
}
</style>
