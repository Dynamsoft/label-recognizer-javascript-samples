import { Component, ViewChild } from '@angular/core';
import { EnumCapturedResultItemType } from "dynamsoft-core";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { LabelRecognizerModule, type RecognizedTextLinesResult } from "@dynamsoft/dynamsoft-label-recognizer";
import { CapturedResultReceiver, CaptureVisionRouter } from "dynamsoft-capture-vision-router";

@Component({
  selector: 'app-video-recognizer',
  templateUrl: './video-recognizer.component.html',
  styleUrls: ['./video-recognizer.component.css']
})
export class VideoRecognizerComponent {
  pCameraView: Promise<CameraView> | null = null;
  pCameraEnhancer: Promise<CameraEnhancer> | null = null;
  pRouter: Promise<CaptureVisionRouter> | null = null;

  @ViewChild('uiContainer') uiContainer: any;
  @ViewChild('resultsContainer') resultsContainer: any;

  async ngOnInit(): Promise<void> {
    try {
      LabelRecognizerModule.onDataLoadProgressChanged = (filePath: string, tag: "starting" | "in progress" | "completed", progress: { loaded: number, total: number }) => {
        if (tag === "starting") {
          console.log('load started...');
        } else if (tag === "completed") {
          console.log('load ended...');
        } else {
          console.log("Loading resources progress: " + progress!.loaded + "/" + progress!.total);
        }
      }

      // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
      const cameraView = await (this.pCameraView = CameraView.createInstance());
      const cameraEnhancer = await (this.pCameraEnhancer = CameraEnhancer.createInstance(cameraView));
      this.uiContainer.nativeElement!.append(cameraView.getUIElement()); // Get default UI and append it to DOM.

      // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
      const router = await (this.pRouter = CaptureVisionRouter.createInstance());
      router.setInput(cameraEnhancer);

      // Define a callback for results.
      const resultReceiver = new CapturedResultReceiver();
      resultReceiver.onRecognizedTextLinesReceived = (result: RecognizedTextLinesResult) => {
        if (!result.textLineResultItems.length) return;

        this.resultsContainer.nativeElement!.innerHTML = "";
        console.log(result);
        for (let item of result.textLineResultItems) {
          this.resultsContainer.nativeElement!.innerHTML += `${item.text}<br><hr>`;
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
    } catch (ex: any) {
      let errMsg = ex.message || ex;
      console.error(errMsg);
      alert(errMsg);
    }
  }

  async ngOnDestroy() {
    (await this.pRouter)!.dispose();
    (await this.pCameraEnhancer)!.dispose();
    (await this.pCameraView)!.dispose();
    console.log('VideoRecognizer Component Unmount');
  }
}
