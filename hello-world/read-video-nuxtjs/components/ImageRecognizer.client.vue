<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import type { TextLineResultItem } from "dynamsoft-label-recognizer"
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";

const iptRef: Ref<HTMLInputElement | null> = ref(null);
const resRef: Ref<HTMLDivElement | null> = ref(null);
const pRouter: Ref<Promise<CaptureVisionRouter> | null> = ref(null);

onMounted(()=>{
    pRouter.value = CaptureVisionRouter.createInstance();
})

onUnmounted(async()=>{
    (await pRouter.value)!.dispose();
    console.log('ImageRecognizer Component Unmount');
})

const captureImage = async (e: any) => {
    try {
        resRef.value!.innerText = "";
        const router = await pRouter.value;
        const results = await router!.capture(e.target.files[0]);
        const res = [];
        for(let result of results.items){
            console.log((result as TextLineResultItem).text);
            res.push((result as TextLineResultItem).text);
        }
        resRef.value!.innerText = res.join("\n");
        iptRef.value!.value = '';
    } catch(ex:any) {
        let errMsg = ex.message || ex;
        console.error(errMsg);
        alert(errMsg);
    }
}
</script>

<template>
    <div class="capture-img">
        <div class="img-ipt"><input type="file" ref="iptRef" @change="captureImage"/></div>
        <div class="result-area" ref="resRef"></div>
    </div>
</template>
    
<style scoped>
.capture-img {
  width: 100%;
  height: 100%;
  font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;
}

.capture-img .img-ipt {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid black;
  margin: 0 auto;
}

.capture-img .result-area {
  margin-top: 20px;
}
</style>