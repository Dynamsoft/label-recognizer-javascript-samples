import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { VideoRecognizerComponent } from './video-recognizer/video-recognizer.component';
import { ImageRecognizerComponent } from './image-recognizer/image-recognizer.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent,
    VideoRecognizerComponent,
    ImageRecognizerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
