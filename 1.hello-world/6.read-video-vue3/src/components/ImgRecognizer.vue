<template>
  <div class="ImgDecode"><input type="file" ref="iptRef" @change="decodeImg"/></div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from '@vue/runtime-core';
import { LabelRecognizer } from "dynamsoft-label-recognizer";
export default {
  name: 'ImgRecognizer',
  setup() {
    const iptRef = ref(null);
    const pRecognizer = ref(null);

    onMounted(async ()=>{
      await (pRecognizer.value = LabelRecognizer.createInstance({runtimeSettings: "numberletter"}));
    })

    const decodeImg = async (e) => {
      try {
        const recognizer = await pRecognizer.value;
        let results = await recognizer.recognize(e.target.files[0]);
        for(let result of results){
          for(let line of result.lineResults) {
            alert(line.text);
            console.log(line.text);
          }
        }
        iptRef.value.value = '';
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

    onBeforeUnmount(async ()=>{
      if(pRecognizer.value) {
        (await pRecognizer.value).destroyContext();
        console.log('ImgRecognizer Component Unmount');
      }
    })

    return {
      decodeImg,
      iptRef
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