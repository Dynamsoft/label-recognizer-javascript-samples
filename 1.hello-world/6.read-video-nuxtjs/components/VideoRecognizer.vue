<template>
  <div id="labelRecognizerUI" ref="elRefs"></div>
</template>

<script>
import { CameraEnhancer } from "dynamsoft-camera-enhancer";
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";

export default {
  data() {
    return {
      bDestroyed: false,
      pRecognizer: null,
      pCameraEnhancer: null
    };
  },
    async mounted() {
        try {
            CameraEnhancer.defaultUIElementURL = LabelRecognizer.defaultUIElementURL;
            let cameraEnhancer = await (this.pCameraEnhancer = this.pCameraEnhancer || CameraEnhancer.createInstance());
            this.$refs.elRefs.appendChild(cameraEnhancer.getUIElement());
            let recognizer = await (this.pRecognizer = this.pRecognizer || LabelRecognizer.createInstance({
                runtimeSettings: "letter"
            }));

            recognizer.setImageSource(cameraEnhancer);

            await recognizer.startScanning(true);

            if (this.bDestroyed) {
                await recognizer.destroyContext();
                cameraEnhancer.dispose();
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
    },
    async beforeDestroy() {
        if (this.pRecognizer) {
            await (await this.pRecognizer).destroyContext();
            (await this.pCameraEnhancer).dispose();
            this.bDestroyed = true;
            console.log('VideoRecognizer Component Unmount');
        }
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
