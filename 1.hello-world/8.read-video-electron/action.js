let pRecognizer = null;
let pCameraEnhancer = null;

Dynamsoft.DLR.LabelRecognizer.engineResourcePath = "https://cdn.jsdelivr.net/npm/keillion-dynamsoft-label-recognizer@0.20220401154537.0/dist/"; 
Dynamsoft.DCE.CameraEnhancer.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@2.3.2/dist/";

Dynamsoft.DLR.LabelRecognizer.license = "DLS2eyJtYWluU2VydmVyVVJMIjoiaHR0cHM6Ly90ZXN0ZGxzLmR5bmFtc29mdC5jb20iLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9";

document.getElementById('recognizeLabel').onclick = async () => {
    try {
        Dynamsoft.DCE.CameraEnhancer.defaultUIElementURL = Dynamsoft.DLR.LabelRecognizer.defaultUIElementURL;
        let cameraEnhancer = await (pCameraEnhancer = pCameraEnhancer || Dynamsoft.DCE.CameraEnhancer.createInstance());
        Dynamsoft.DLR.LabelRecognizer.onResourcesLoadStarted = () => { console.log('load started...'); }
        Dynamsoft.DLR.LabelRecognizer.onResourcesLoadProgress = (resourcesPath, progress)=>{
            console.log("Loading resources progress: " + progress.loaded + "/" + progress.total);
        };
        Dynamsoft.DLR.LabelRecognizer.onResourcesLoaded = () => { console.log('load ended...'); }
        let recognizer = await (pRecognizer = pRecognizer || Dynamsoft.DLR.LabelRecognizer.createInstance({
            runtimeSettings: "letter"
        }));
        
        await document.getElementById('div-video-container').append(cameraEnhancer.getUIElement());
        recognizer.setImageSource(cameraEnhancer);

        await recognizer.startScanning(true);

        recognizer.onImageRead = results => {
            for (let result of results) {
                for (let lineResult of result.lineResults) {7
                    console.log(lineResult.text);
                }
            }
        };
        recognizer.onUniqueRead = (txt) => {
            alert(txt);
            console.log("Unique Code Found: " + txt);
        }
        recognizer.onMRZRead = (txt) => {
            alert(txt);
            console.log("MRZ Code Found: " + txt);
        }
    } catch (ex) {
        alert(ex.message);
        throw ex;
    }
};
