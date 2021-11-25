<template>
  <div id="labelRecognizerUI"></div>
</template>

<script>
import DLR from "../dlr";
import DCE from "../dce";

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

            let cameraEnhancer = await (this.pCameraEnhancer = this.pCameraEnhancer || DCE.createInstance());
            let recognizer = await (this.pRecognizer = this.pRecognizer || DLR.createInstance({
                runtimeSettings: "video-letter"
            }));

            await cameraEnhancer.setUIElement(DLR.defaultUIElementURL);
            recognizer.cameraEnhancer = cameraEnhancer;

            await recognizer.startScanning(true);

            if (this.bDestroyed) {
                recognizer.destroy();
                cameraEnhancer.destroy();
                return;
            }

            recognizer.onFrameRead = (results) => {
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
            this.$emit("appendMessage", { msg: ex.message, type: "error" });
            console.error(ex);
        }
    },
    async beforeDestroy() {
        if (this.pRecognizer) {
            (await this.pRecognizer).destroy();
            (await this.pCameraEnhancer).destroy();
            this.bDestroyed = true;
        }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#barcodeScannerUI {
  width: 100%;
  height: 100%;
}
</style>
