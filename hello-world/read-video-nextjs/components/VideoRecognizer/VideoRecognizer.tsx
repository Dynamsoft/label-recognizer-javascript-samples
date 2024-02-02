"use client"

import { useEffect, useRef, MutableRefObject } from 'react';
import { CameraEnhancer, CameraView } from 'dynamsoft-camera-enhancer';
import { LabelRecognizerModule, RecognizedTextLinesResult } from 'dynamsoft-label-recognizer';
import { CaptureVisionRouter, CapturedResultReceiver } from 'dynamsoft-capture-vision-router';
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import { EnumCapturedResultItemType } from 'dynamsoft-core';
import "./VideoRecognizer.css";

function VideoRecognizer() {
    const uiContainer: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const resultsContainer: MutableRefObject<HTMLDivElement | null> = useRef(null);

    const pCameraView: MutableRefObject<Promise<CameraView> | null> = useRef(null);
    const pCameraEnhancer: MutableRefObject<Promise<CameraEnhancer> | null> = useRef(null);
    const pRouter: MutableRefObject<Promise<CaptureVisionRouter> | null> = useRef(null);
    useEffect((): any => {
        const init = async () => {
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
            const cameraView = await (pCameraView.current = CameraView.createInstance());
            const cameraEnhancer = await (pCameraEnhancer.current = CameraEnhancer.createInstance(cameraView));
            uiContainer.current!.append(cameraView.getUIElement()); // Get default UI and append it to DOM.

            // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
            const router = await (pRouter.current = CaptureVisionRouter.createInstance());
            router.setInput(cameraEnhancer);

            // Define a callback for results.
            const resultReceiver = new CapturedResultReceiver();
            resultReceiver.onRecognizedTextLinesReceived = (result: RecognizedTextLinesResult) => {
                if (!result.textLinesResultItems.length) return;

                resultsContainer.current!.innerHTML = "";
                console.log(result);
                for (let item of result.textLinesResultItems) {
                    resultsContainer.current!.innerHTML += `${item.text}<br><hr>`;
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
        }
        init();

        return async () => {
            if (pRouter.current) {
                (await pRouter.current)!.dispose();
                (await pCameraEnhancer.current)!.dispose();
            }
            console.log('VideoRecognizer Component Unmount');
        }
    }, []);

    return (
        <div>
            <div ref={uiContainer} className="div-ui-container"></div>
            Results:
            <br />
            <div ref={resultsContainer} className="div-results-container"></div>
        </div>
    );
}

export default VideoRecognizer;
