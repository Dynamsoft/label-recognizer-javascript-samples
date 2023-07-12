import { Component, ViewChild } from '@angular/core';
import { LabelRecognizer } from 'dynamsoft-label-recognizer';

@Component({
  selector: 'app-image-recognizer',
  templateUrl: './image-recognizer.component.html',
  styleUrls: ['./image-recognizer.component.css']
})
export class ImageRecognizerComponent {
  dlr: Promise<LabelRecognizer> | null = null;

  @ViewChild('iptRef') iptRef: any;
  @ViewChild('resRef') resRef: any;

  ngOnInit(): void {
    this.dlr = LabelRecognizer.createInstance({runtimeSettings: "mrz"});
  }

  recognizeImg = async (e: any) => {
    try {
      this.iptRef.nativeElement.innerText = "";
      const recognizer = await this.dlr;
      const results = await recognizer!.recognize(e.target.files[0]);
      const res = [];
      for(let result of results){
        for(let line of result.lineResults) {
          console.log(line.text);
          res.push(line.text);
        }
      }
      this.resRef.nativeElement!.innerText = res.join("\n");
      this.iptRef.nativeElement!.value = '';
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
    console.log('ImageRecognizer Component Unmount');
  }
}
