<template>
  <div className="helloWorld">
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
import VideoRecognizer from "./VideoRecognizer";
import ImgRecognizer from './ImgRecognizer.vue'
import { ref, onMounted } from "vue";
import { LabelRecognizer } from "dynamsoft-label-recognizer";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const libLoaded = ref(false);
    const bShowRecognizer = ref(true);
    const bShowImgRecognize = ref(false);
    onMounted(async () => {
      try {
        //Load the library on page load to speed things up.
        await LabelRecognizer.loadWasm();
        libLoaded.value = true;
        showRecognizer();
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
    });
    const showRecognizer = () => {
      bShowRecognizer.value = true;
      bShowImgRecognize.value = false;
    };
    const showImgRecognize = () => {
      bShowRecognizer.value = false;
      bShowImgRecognize.value = true;
    }
    
    return {
      libLoaded,
      bShowRecognizer,
      bShowImgRecognize,
      showRecognizer,
      showImgRecognize
    };
  },
  components: {
    VideoRecognizer,ImgRecognizer
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#UIElement {
  margin: 2vmin auto;
  text-align: center;
  font-size: medium;
  height: 40vh;
  width: 80vw;
}
.applogo {
  height: 25px;
}
button {
  font-size: 1.5rem;
  margin: 1.5vh 0;
  border: 1px solid black;
  background-color: white;
  color: black;
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

h1 {
  font-size: 1.5em;
}
</style>
