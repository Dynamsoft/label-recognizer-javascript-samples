<template>
  <div class="helloWorld">
    <h1>{{ msg }} <img class="applogo" alt="Vue logo" src="../assets/logo.png" /></h1>
     <div className="btn-group" v-if="libLoaded">
        <button :style="{marginRight: '10px', backgroundColor: bShowRecognizer ? 'rgb(255,174,55)' : 'white'}" @click="showRecognizer">Video Recognizer</button>
        <button :style="{backgroundColor: bShowImgRecognize ? 'rgb(255,174,55)' : 'white'}" @click="showImgRecognize">Image Recognizer</button>
    </div>
    <div id="UIElement">
      <span style="font-size: x-large" v-if="!libLoaded">Loading Library...</span>
      <VideoRecognizer v-if="bShowRecognizer"></VideoRecognizer>
      <ImgRecognizer v-if="bShowImgRecognize"></ImgRecognizer>
    </div>
  </div>
</template>

<script>
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import VideoRecognizer from "./VideoRecognizer.vue";
import ImgRecognizer from "./ImgRecognizer.vue"

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      libLoaded: false,
      bShowRecognizer: true,
      bShowImgRecognize: false
    };
  },
  async mounted() {
    //Load the library on page load to speed things up.
    try {
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
  components: {
    VideoRecognizer, ImgRecognizer
  },
  methods: {
    showRecognizer() {
      this.bShowRecognizer = true;
      this.bShowImgRecognize = false;
    },
    showImgRecognize() {
      this.bShowRecognizer = false;
      this.bShowImgRecognize = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

h1 {
  font-size: 1.5em;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
.applogo {
  height: 25px;
}
.helloWorld {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  color: #455a64;
}

button {
  font-size: 1.5rem;
  margin-bottom: 2vh;
}

span {
  font-size: 0.8rem;
}

#UIElement {
  margin: 2vmin auto;
  text-align: center;
  font-size: medium;
  height: 40vh;
  width: 80vw;
}

#UIElement img {
  max-width: 100%;
  max-height: 90%;
  border: solid 1px gray;
}
</style>
