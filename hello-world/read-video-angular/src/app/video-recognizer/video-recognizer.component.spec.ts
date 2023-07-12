import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRecognizerComponent } from './video-recognizer.component';

describe('VideoRecognizerComponent', () => {
  let component: VideoRecognizerComponent;
  let fixture: ComponentFixture<VideoRecognizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoRecognizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoRecognizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
