import { Component, ViewChild } from '@angular/core';
import type { TextLineResultItem } from "@dynamsoft/dynamsoft-label-recognizer"
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";

@Component({
  selector: 'app-image-recognizer',
  templateUrl: './image-recognizer.component.html',
  styleUrls: ['./image-recognizer.component.css']
})
export class ImageRecognizerComponent {
  pRouter: Promise<CaptureVisionRouter> | null = null;

  @ViewChild('iptRef') iptRef: any;
  @ViewChild('resRef') resRef: any;

  ngOnInit(): void {
    this.pRouter = CaptureVisionRouter.createInstance();
  }

  captureImage = async (e: any) => {
    try {
      this.resRef!.innerText = "";
      const router = await this.pRouter;
      const results = await router!.capture(e.target.files[0]);
      const res = [];
      for (let result of results.items) {
        console.log((result as TextLineResultItem).text);
        res.push((result as TextLineResultItem).text);
      }
      this.resRef.nativeElement!.innerText = res.join("\n");
      this.iptRef.nativeElement!.value = '';
    } catch (ex: any) {
      let errMsg: string;
      if (ex.message.includes("network connection error")) {
        errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
      } else {
        errMsg = ex.message || ex;
      }
      console.error(errMsg);
      alert(errMsg);
    }
  }

  async ngOnDestroy() {
    (await this.pRouter)!.dispose();
    console.log('ImageRecognizer Component Unmount');
  }
}
