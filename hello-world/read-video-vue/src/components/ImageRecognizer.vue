<template>
  <div class="recognize-img">
    <div class="img-ipt"><input type="file" ref="iptRef" @change="recognizeImg"/></div>
    <div class="result-area" ref="resRef"></div>
  </div>
</template>

<script>
import { LabelRecognizer } from "dynamsoft-label-recognizer";
export default {
  name: 'ImgRecognize',
  data() {
    return {
      dlr: null,
    }
  },
  async mounted() {
    this.dlr = LabelRecognizer.createInstance({runtimeSettings: "mrz"});
  },
  methods: {
    async recognizeImg(e) {
      try {
        this.$refs.resRef.innerText = "";
        const recognizer = await this.dlr;
        const results = await recognizer.recognize(e.target.files[0]);
        const res = [];
        for(let result of results){
          for(let line of result.lineResults) {
            console.log(line.text);
            res.push(line.text);
          } 
        }
        this.$refs.resRef.innerText = res.join("\n");
        this.$refs.iptRef.value = '';
      } catch(ex) {
        let errMsg;
        if (ex.message.includes("network connection error")) {
          errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
        } else {
          errMsg = ex.message||ex;
        }
        console.error(errMsg);
        alert(errMsg);
      }
    }
  },
  async beforeDestroy() {
    (await this.dlr).destroyContext();
    console.log('ImageRecognizer Component Unmount');
  },
}
</script>

<style scoped>
.recognize-img {
  width: 100%;
  height: 100%;
  font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;
}

.recognize-img .img-ipt {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid black;
  margin: 0 auto;
}

.recognize-img .result-area {
  margin-top: 20px;
}
</style>