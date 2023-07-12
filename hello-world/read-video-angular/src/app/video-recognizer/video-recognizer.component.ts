import { Component, ViewChild } from '@angular/core';
import { CameraEnhancer, DrawingItem } from 'dynamsoft-camera-enhancer';
import { LabelRecognizer } from 'dynamsoft-label-recognizer';

@Component({
  selector: 'app-video-recognizer',
  templateUrl: './video-recognizer.component.html',
  styleUrls: ['./video-recognizer.component.css']
})
export class VideoRecognizerComponent {
  dce: Promise<CameraEnhancer> | null = null;
  dlr: Promise<LabelRecognizer> | null = null;

  @ViewChild('container') container: any;

  async ngOnInit(): Promise<void> {
    LabelRecognizer.onResourcesLoadStarted = () => { console.log('load started...'); }
    LabelRecognizer.onResourcesLoadProgress = (resourcesPath, progress)=>{console.log("Loading resources progress: " + progress!.loaded + "/" + progress!.total);};
    LabelRecognizer.onResourcesLoaded = () => { console.log('load ended...'); }
    try {
      const cameraEnhancer = await (this.dce = CameraEnhancer.createInstance());
      const recognizer = await (this.dlr = LabelRecognizer.createInstance());
      await cameraEnhancer.setUIElement(this.container!.nativeElement);
      await recognizer.setImageSource(cameraEnhancer, {resultsHighlightBaseShapes: DrawingItem});
      await recognizer.updateRuntimeSettingsFromString("video-mrz");
      cameraEnhancer.setVideoFit("cover");

      // Triggered when the video frame is recognized
      recognizer.onImageRead = (results) => {
        for (let result of results) {
          for (let lineResult of result.lineResults) {
            console.log("Image Read: ", lineResult.text);
          }
        }
      };

      // Triggered when a different result is recognized
      recognizer.onUniqueRead = (txt) => {
        alert(txt);
        console.log("Unique Code Found: " + txt);
      }

      // Callback to MRZ recognizing result
      recognizer.onMRZRead = async (txt, results) => {
        console.log("MRZ results: \n", txt, "\n", results);
      }

      // Callback to VIN recognizing result
      recognizer.onVINRead = (txt, results) => {
        console.log("VIN results: ",txt, results);
      }

      await recognizer.startScanning(true);
    } catch(ex: any) {
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
    (await this.dlr)!.destroyContext();
    (await this.dce)!.dispose(true);
    console.log('VideoRecognizer Component Unmount');
  }
}
