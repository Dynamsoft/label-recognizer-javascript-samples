<template>
  <div id="labelRecognizerUI" ref="root"></div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { CameraEnhancer } from "dynamsoft-camera-enhancer";
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";

export default {
  setup() {
    const root = ref(null);
    const pRecognizer = ref(null);
    const pCameraEnhancer = ref(null);
    const bDestroyed = ref(false);
    onMounted(async () => {
      try {
        CameraEnhancer.defaultUIElementURL = LabelRecognizer.defaultUIElementURL;
        let cameraEnhancer = await (pCameraEnhancer.value = pCameraEnhancer.value || CameraEnhancer.createInstance());
        root.value.appendChild(cameraEnhancer.getUIElement());
        let recognizer = await (pRecognizer.value = pRecognizer.value || LabelRecognizer.createInstance({
            runtimeSettings: "letter"
        }));

        recognizer.setImageSource(cameraEnhancer);

        await recognizer.startScanning(true);
        if(bDestroyed.value) {
          await recognizer.value.destroyContext();
          cameraEnhancer.value.dispose();
          return;
        }
        recognizer.onImageRead = (results) => {
          for (let result of results) {
            for (let lineResult of result.lineResults) {
                console.log(lineResult.text);
            }
          }
        };
        recognizer.onUniqueRead = (txt) => {
            alert(txt);
            console.log("Unique Code Found: " + txt);
        }

      } catch (ex) {
        console.error(ex);
      }
    });
    onBeforeUnmount(async () => {
      bDestroyed.value = true;
      if (pRecognizer.value) {
        await (await pRecognizer.value).destroyContext();
        (await pCameraEnhancer.value).dispose();
        console.log('VideoRecognizer Component Unmount');
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
