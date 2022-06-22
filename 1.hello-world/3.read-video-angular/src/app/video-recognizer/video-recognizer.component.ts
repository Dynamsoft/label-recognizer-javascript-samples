import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraEnhancer } from 'dynamsoft-camera-enhancer';
import { LabelRecognizer } from 'dynamsoft-label-recognizer';
@Component({
  selector: 'app-video-recognizer',
  templateUrl: './video-recognizer.component.html',
  styleUrls: ['./video-recognizer.component.css']
})
export class VideoRecognizerComponent implements OnInit {
  pRecognizer = null;
  pCameraEnhancer = null;

  @ViewChild('container') container: any;

  async ngOnInit(): Promise<void> {
    try {
      let cameraEnhancer = await (this.pCameraEnhancer = CameraEnhancer.createInstance());
      cameraEnhancer.setUIElement((this as any).container.nativeElement);
      LabelRecognizer.onResourcesLoadStarted = () => { console.log('load started...'); }
      LabelRecognizer.onResourcesLoadProgress = (resourcesPath, progress)=>{
          console.log("Loading resources progress: " + progress.loaded + "/" + progress.total);
      };
      LabelRecognizer.onResourcesLoaded = () => { console.log('load ended...'); }
      let recognizer = await (this.pRecognizer = LabelRecognizer.createInstance());

      recognizer.setImageSource(cameraEnhancer);
      await recognizer.updateRuntimeSettingsFromString("video-numberletter");
      cameraEnhancer.ifShowScanRegionLaser = true;

      await recognizer.startScanning(true);

      // Triggered when the video frame is decoded
      recognizer.onImageRead = (results: any) => {
        for (let result of results) {
          for (let lineResult of result.lineResults) {
            console.log("Image Read: ", lineResult.text);
          }
        }
      };

      // Triggered when a different result is decoded
      recognizer.onUniqueRead = (txt: string) => {
        alert(txt);
        console.log("Unique Code Found: " + txt);
      }

      // Callback to MRZ decoding result
      recognizer.onMRZRead = (txt: string, results: any) => {
        console.log("MRZ text: ",txt);
        console.log("MRZ results: ", results);
      }

      // Callback to VIN decoding result
      recognizer.onVINRead = (txt: string) => {
        console.log("VIN results: ",txt);
      }
  } catch (ex) {
    let errMsg: string;
    if (ex.message.includes("network connection error")) {
      errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
    } else {
      errMsg = ex.message||ex;
    }
    console.error(errMsg);
    alert(errMsg);
  }
  }
  async ngOnDestroy() {
    if (this.pRecognizer) {
      await (await this.pRecognizer).destroyContext();
      (await this.pCameraEnhancer).dispose();
      console.log('VideoRecognizer Component Unmount');
    }
  }
}
