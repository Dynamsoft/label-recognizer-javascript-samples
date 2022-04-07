let pRecognizer = null;
let pCameraEnhancer = null;

Dynamsoft.DLR.LabelRecognizer.engineResourcePath = "https://cdn.jsdelivr.net/npm/keillion-dynamsoft-label-recognizer@0.20220401154537.0/dist/"; 
Dynamsoft.DCE.CameraEnhancer.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@2.3.2/dist/";

/** LICENSE ALERT - README 
 * To use the library, you need to first specify a license key using the API "license" as shown below.
 */
Dynamsoft.DLR.LabelRecognizer.license = "DLS2eyJtYWluU2VydmVyVVJMIjoiaHR0cHM6Ly90ZXN0ZGxzLmR5bmFtc29mdC5jb20iLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9";
/** 
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&product=dlr&package=js to get your own trial license good for 30 days. 
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/label-recognition/programming/javascript/user-guide.html?ver=latest#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END 
 */

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
            runtimeSettings: "numberletter"
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
    } catch (ex) {
        alert(ex.message);
        throw ex;
    }
};
