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
      await recognizer.updateRuntimeSettingsFromString("video-numberLetter");
      cameraEnhancer.ifShowScanRegionLaser = true;

      await recognizer.startScanning(true);

      recognizer.onImageRead = results => {
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
  }
  async ngOnDestroy() {
    if (this.pRecognizer) {
      await (await this.pRecognizer).destroyContext();
      (await this.pCameraEnhancer).dispose();
      console.log('VideoRecognizer Component Unmount');
    }
  }
}
