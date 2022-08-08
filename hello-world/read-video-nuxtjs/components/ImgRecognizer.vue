<template>
  <div class="ImgRecognize"><input type="file" ref="iptRef" @change="recognizeImg"/></div>
</template>

<script>
import { LabelRecognizer } from "dynamsoft-label-recognizer";
export default {
  name: 'ImgRecognize',
  data() {
    return {
      pRecognizer: null,
    }
  },
  async mounted() {
    await (this.pRecognizer = LabelRecognizer.createInstance({runtimeSettings: "numberletter"}));
  },
  methods: {
    async recognizeImg(e) {
      try {
        const recognizer = await this.pRecognizer;
        let results = await recognizer.recognize(e.target.files[0]);
        for(let result of results){
          for(let line of result.lineResults) {
            alert(line.text);
            console.log(line.text);
          }
        }
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
    if(this.pRecognizer) {
      (await this.pRecognizer).destroyContext();
      console.log('ImgRecognizer Component Unmount');
    }
  },
}
</script>

<style scoped>
  .ImgRecognize {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 90%;
    border: 1px solid black
  }
</style>