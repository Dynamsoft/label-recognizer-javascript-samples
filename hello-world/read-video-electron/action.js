let router = null;
let cameraEnhancer = null;
let promiseCVRReady;

const cameraViewContainer = document.querySelector("#div-ui-container");
const resultsContainer = document.querySelector("#div-results-container");
const textLoading = document.querySelector("#text-loading");

/** LICENSE ALERT - README 
 * To use the library, you need to first specify a license key using the API "license" as shown below.
 */
Dynamsoft.License.LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");
/** 
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&product=dlr&package=js to get your own trial license good for 30 days. 
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/label-recognition/programming/javascript/user-guide.html?ver=latest#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END 
 */

Dynamsoft.DLR.LabelRecognizerModule.onDataLoadProgressChanged = (modelPath, tag, progress) => {
    if (tag === "starting") {
        textLoading.style.display = "inline";
    } else if (tag === "completed") {
        textLoading.style.display = "none";
    };
}

Dynamsoft.Core.CoreModule.engineResourcePaths = {
    std: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-std@1.2.10/dist/",
    dip: "https://cdn.jsdelivr.net/npm/dynamsoft-image-processing@2.2.30/dist/",
    dnn: 'https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-dnn@1.0.20/dist/',
    dlrData: "https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer-data@1.0.10/dist/"
};

/**
 * Preloads the `LabelRecognizer` module
 */
Dynamsoft.Core.CoreModule.loadWasm(["DLR"]);

/**
 * Creates a CameraEnhancer instance for later use.
 */
async function initDCE() {
    const view = await Dynamsoft.DCE.CameraView.createInstance();
    cameraEnhancer = await Dynamsoft.DCE.CameraEnhancer.createInstance(view);
    cameraViewContainer.append(view.getUIElement());
}

/**
 * Creates a CaptureVisionRouter instance and configure the task to recognize text.
 * Also, make sure the original image is returned after it has been processed.
 */
let cvrReady = (async function initCVR() {
    await initDCE();
    router = await Dynamsoft.CVR.CaptureVisionRouter.createInstance();
    router.setInput(cameraEnhancer);

    /* Defines the result receiver for the task.*/
    const resultReceiver = new Dynamsoft.CVR.CapturedResultReceiver();
    resultReceiver.onRecognizedTextLinesReceived = (result) => {
        if (!result.textLineResultItems.length) return;
        resultsContainer.innerHTML = "";
        console.log(result);
        for (let item of result.textLineResultItems) {
            resultsContainer.innerHTML += `${item.text}<br><hr>`;
        }
    };
    await router.addResultReceiver(resultReceiver);

    // Filter out unchecked and duplicate results.
    const filter = new Dynamsoft.Utility.MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification("text_line", true); // Filter out unchecked text lines.
    // Filter out duplicate text lines within 3 seconds.
    filter.enableResultDeduplication("text_line", true);
    filter.setDuplicateForgetTime("text_line", 3000);
    await router.addResultFilter(filter);
})();

document.getElementById('recognizeLabel').onclick = async () => {
    try {
        await (promiseCVRReady = promiseCVRReady || (async () => {
            await cvrReady;
            /* Starts streaming the video. */
            await cameraEnhancer.open();
            /* Uses the built-in template "RecognizeTextLines_Default" to start a recognize task. */
            await router.startCapturing("RecognizeTextLines_Default");
        })());
    } catch (ex) {
        let errMsg = ex.message || ex;
        console.error(errMsg);
        alert(errMsg);
    }
};
