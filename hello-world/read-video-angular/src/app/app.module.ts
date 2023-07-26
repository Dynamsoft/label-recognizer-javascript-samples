import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImageRecognizerComponent } from './image-recognizer/image-recognizer.component';
import { VideoRecognizerComponent } from './video-recognizer/video-recognizer.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageRecognizerComponent,
    VideoRecognizerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
