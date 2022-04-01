<template>
  <div class="ImgDecode"><input type="file" ref="iptRef" @change="decodeImg"/></div>
</template>

<script>
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";
export default {
  name: 'ImgDecode',
  data() {
    return {
      pReader: null,
      reader: null
    }
  },
  async mounted() {
    this.reader = await (this.pReader = LabelRecognizer.createInstance({runtimeSettings: "letter"}));
  },
  methods: {
    async decodeImg(e) {
      try {
        let results = await this.reader.recognize(e.target.files[0]);
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
    if(this.pReader) {
      (await this.pReader).destroyContext();
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