<script setup>
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import { onMounted, onUnmounted, ref } from "vue";

const iptRef = ref(null);
const resRef = ref(null);
let dlr = ref(null);

onMounted(()=>{
    dlr = LabelRecognizer.createInstance({runtimeSettings: "mrz"});
})

onUnmounted(async()=>{
    (await dlr).destroyContext();
    console.log('ImgRecognizer Component Unmount');
})

const recognizeImg = async (e) => {
    resRef.value.innerText = "";
    const recognizer = await dlr;
    const results = await recognizer.recognize(e.target.files[0]);
    const res = [];
    for(let result of results){
        for(let line of result.lineResults) {
            console.log(line.text);
            res.push(line.text);
        } 
    }
    resRef.value.innerText = res.join("\n");
    iptRef.value.value = '';
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