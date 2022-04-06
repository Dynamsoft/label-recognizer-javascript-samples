<template>
  <div class="ImgDecode"><input type="file" ref="iptRef" @change="decodeImg"/></div>
</template>

<script>
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";
export default {
  name: 'ImgDecode',
  data() {
    return {
      pRecognizer: null,
    }
  },
  async mounted() {
    await (this.pRecognizer = LabelRecognizer.createInstance({runtimeSettings: "letter"}));
  },
  methods: {
    async decodeImg(e) {
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
        console.error(ex);
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
  .ImgDecode {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 90%;
    border: 1px solid black
  }
</style>