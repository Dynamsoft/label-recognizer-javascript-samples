<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { EnumCapturedResultItemType } from "dynamsoft-core";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { LabelRecognizerModule, type RecognizedTextLinesResult } from "@dynamsoft/dynamsoft-label-recognizer";
import { CapturedResultReceiver, CaptureVisionRouter } from "dynamsoft-capture-vision-router";

const uiContainer: Ref<HTMLElement | null> = ref(null);
const resultsContainer: Ref<HTMLElement | null> = ref(null);

const pInit: Ref<Promise<{
    cameraView: CameraView;
    cameraEnhancer: CameraEnhancer;
    router: CaptureVisionRouter;
}> | null> = ref(null);

const init = async (): Promise<{
    cameraView: CameraView;
    cameraEnhancer: CameraEnhancer;
    router: CaptureVisionRouter;
}> => {
    try {
        LabelRecognizerModule.onDataLoadProgressChanged = (filePath: string, tag: string, progress: { loaded: number, total: number }) => {
            if (tag === "starting") {
                console.log('load started...');
            } else if (tag === "completed") {
                console.log('load ended...');
            } else {
                console.log("Loading resources progress: " + progress!.loaded + "/" + progress!.total);
            }
        }

        // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
        const cameraView = await CameraView.createInstance();
        const cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
        uiContainer.value!.append(cameraView.getUIElement()); // Get default UI and append it to DOM.

        // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
        const router = await CaptureVisionRouter.createInstance();
        router.setInput(cameraEnhancer);

        // Define a callback for results.
        const resultReceiver = new CapturedResultReceiver();
        resultReceiver.onRecognizedTextLinesReceived = (result: RecognizedTextLinesResult) => {
            if (!result.textLinesResultItems.length) return;

            resultsContainer.value!.innerHTML = "";
            console.log(result);
            for (let item of result.textLinesResultItems) {
                resultsContainer.value!.innerHTML += `${item.text}<br><hr>`;
            }
        };
        router.addResultReceiver(resultReceiver);

        // Filter out unchecked and duplicate results.
        const filter = new MultiFrameResultCrossFilter();
        filter.enableResultCrossVerification(EnumCapturedResultItemType.CRIT_TEXT_LINE, true); // Filter out unchecked text.
        // Filter out duplicate barcodes within 3 seconds.
        filter.enableResultDeduplication(EnumCapturedResultItemType.CRIT_TEXT_LINE, true);
        filter.setDuplicateForgetTime(EnumCapturedResultItemType.CRIT_TEXT_LINE, 3000);
        await router.addResultFilter(filter);

        // Open camera and start scanning text.
        await cameraEnhancer.open();
        await router.startCapturing("RecognizeTextLines_Default");
        return {
            cameraView,
            cameraEnhancer,
            router,
        };
    } catch (ex: any) {
        let errMsg = ex.message || ex;
        console.error(errMsg);
        alert(errMsg);
        throw ex;
    }
};

onMounted(async () => {
    pInit.value = init();
})

onUnmounted(async () => {
    if (pInit.value) {
        const { cameraView, cameraEnhancer, router } = await pInit.value;
        router.dispose();
        cameraEnhancer.dispose();
        cameraView.dispose();
    }
    console.log("VideoCapture Component Unmount");
})
</script>

<template>
    <div>
        <div ref="uiContainer" class="div-ui-container"></div>
        Results:
        <br />
        <div ref="resultsContainer" class="div-results-container"></div>
    </div>
</template>
    
<style scoped>
.div-ui-container {
    width: 100%;
    height: 70vh;
    background: #eee;
}

.div-results-container {
    width: 100%;
    height: 10vh;
    overflow: auto;
}
</style>