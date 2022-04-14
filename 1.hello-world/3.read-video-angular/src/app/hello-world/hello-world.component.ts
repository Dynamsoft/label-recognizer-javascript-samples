import { Component, OnInit } from '@angular/core';
import '../dce'; // import side effects. The license, engineResourcePath, so on.
import '../dlr'; // import side effects. The license, engineResourcePath, so on.
import { LabelRecognizer } from "dynamsoft-label-recognizer";

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {
  bShowRecognizer = true;
  bShowImgDecode = false;
  async ngOnInit(): Promise<void> {
    // Load the library on page load to speed things up.
    try {
      await LabelRecognizer.loadWasm();
    } catch (ex) {
      alert(ex.message);
    }
  }
  showScanner(): void {
    this.bShowRecognizer = true;
    this.bShowImgDecode = false;
  }
  showImgDecode(): void {
    this.bShowRecognizer = false;
    this.bShowImgDecode = true;
  }
}
