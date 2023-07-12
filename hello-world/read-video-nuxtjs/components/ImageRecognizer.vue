<script setup lang="ts">
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import { onMounted, onUnmounted, ref, type Ref } from "vue";

const iptRef: Ref<HTMLInputElement | null> = ref(null);
const resRef: Ref<HTMLDivElement | null> = ref(null);
const dlr: Ref<Promise<LabelRecognizer> | null> = ref(null);

onMounted(()=>{
    dlr.value = LabelRecognizer.createInstance({runtimeSettings: "mrz"});
})

onUnmounted(async()=>{
    (await dlr.value)!.destroyContext();
    console.log('ImageRecognizer Component Unmount');
})

const recognizeImg = async (e: any) => {
    try {
    resRef.value!.innerText = "";
    const recognizer = await dlr.value;
    const results = await recognizer!.recognize(e.target.files[0]);
    const res = [];
    for(let result of results){
        for(let line of result.lineResults) {
            console.log(line.text);
            res.push(line.text);
        } 
    }
    resRef.value!.innerText = res.join("\n");
    iptRef.value!.value = '';
    } catch(ex:any) {
        let errMsg: string;
        if (ex.message.includes("network connection error")) {
            errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
        } else {
            errMsg = ex.message||ex;
        }
        console.error(errMsg);
        alert(errMsg);
    }
}
</script>

<template>
    <div class="recognize-img">
        <div class="img-ipt"><input type="file" ref="iptRef" @change="recognizeImg"/></div>
        <div class="result-area" ref="resRef"></div>
    </div>
</template>
    
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