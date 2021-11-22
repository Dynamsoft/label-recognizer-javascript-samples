<template>
  <div id="labelRecognizerUI" ref="root"></div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from "vue";
import DLR from "../dlr";
import DCE from "../dce";

export default {
  setup(props, context) {
    const root = ref(null);
    const pRecognizer = ref(null);
    const pCameraEnhancer = ref(null);
    const bDestroyed = ref(false);
    onMounted(async () => {
      try {

        let cameraEnhancer = await (pCameraEnhancer.value = pCameraEnhancer.value || DCE.createInstance());
        let recognizer = await (pRecognizer.value = pRecognizer.value || DLR.createInstance({
            runtimeSettings: "video-letter"
        }));

        await cameraEnhancer.setUIElement(DLR.defaultUIElementURL);
        recognizer.cameraEnhancer = cameraEnhancer;

        if (bDestroyed.value) {
          recognizer.destroy();
          return;
        }
        
        await recognizer.startScanning(true);

        recognizer.onFrameRead = (results) => {
          for (let result of results) {
            for (let lineResult of result.lineResults) {
              console.log(lineResult.text);
              context.emit('appendMessage({ format: lineResult.format, text: lineResult.text, type: "result" })');
              if (lineResult.text.indexOf("Attention(exceptionCode") !== -1) {
                context.emit('appendMessage({ msg: lineResult.exception.message, type: "error" })');
              }
            }
          }
        }

        recognizer.onUniqueRead = (txt) => {
          alert(txt);
          console.log("Unique Code Found: " + txt);
        }
        
      } catch (ex) {
        context.emit("appendMessage", { msg: ex.message, type: "error" });
        console.error(ex);
      }
    });
    onBeforeUnmount(async () => {
      if (pRecognizer.value) {
        (await pRecognizer.value).destroy();
        bDestroyed.value = true;
      }
    });
    return {
      root,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#labelRecognizerUI {
  width: 100%;
  height: 100%;
}
</style>
