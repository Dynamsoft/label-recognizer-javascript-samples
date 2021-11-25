const DCE = require('dynamsoft-camera-enhancer');
const DLR = require('keillion-dynamsoft-label-recognizer');

window.onload = function () {

    let pRecognizer = null;
    let pCameraEnhancer = null;
    
    DLR.LabelRecognizer.engineResourcePath = "https://cdn.jsdelivr.net/npm/keillion-dynamsoft-label-recognizer@0.20211119103311.0/dist/"; 
    DCE.CameraEnhancer.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@2.0.3/dist/";

    DLR.LabelRecognizer.initLicense("t0068MgAAAKUZULwM1SshTkeSYEV5LPo0cnYXkSYBlpGkb0XcP1NTLvP+//NMWCbQfuyxGn1hbLfqF/bV7FuoMzNPJljQqW0=");

    document.getElementById('recognizeLabel').onclick = async () => {
        try {

            let cameraEnhancer = await (pCameraEnhancer = pCameraEnhancer || DCE.CameraEnhancer.createInstance());
            let recognizer = await (pRecognizer = pRecognizer || DLR.LabelRecognizer.createInstance({
                runtimeSettings: "video-letter"
            }));

            await cameraEnhancer.setUIElement(DLR.LabelRecognizer.defaultUIElementURL);
            recognizer.cameraEnhancer = cameraEnhancer;

            await recognizer.startScanning(true);

            recognizer.onFrameRead = results => {
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
            alert(ex.message);
            throw ex;
        }
    };
}