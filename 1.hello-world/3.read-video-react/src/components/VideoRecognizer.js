import { CameraEnhancer } from "dynamsoft-camera-enhancer";
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";
import React from 'react';

class VideoRecognizer extends React.Component {
    constructor(props) {
        super(props);
        this.bDestroyed = false;
        this.pRecognizer = null;
        this.pCameraEnhancer = null;
        this.elRef = React.createRef();
    }
    async componentDidMount() {
        try {
            CameraEnhancer.defaultUIElementURL = LabelRecognizer.defaultUIElementURL;
            let cameraEnhancer = await (this.pCameraEnhancer = this.pCameraEnhancer || CameraEnhancer.createInstance());
            this.elRef.current.appendChild(cameraEnhancer.getUIElement());
            let recognizer = await (this.pRecognizer = this.pRecognizer || LabelRecognizer.createInstance({
                runtimeSettings: "letter"
            }))
            recognizer.setImageSource(cameraEnhancer);

            await recognizer.startScanning(true);

            if (this.bDestroyed) {
                await recognizer.destroyContext();
                cameraEnhancer.dispose();
                return;
            }

            recognizer.onImageRead = results => {
                for (let result of results) {
                    for (let lineResult of result.lineResults) {
                        console.log(lineResult.text);
                        if (lineResult.text.indexOf("Attention(exceptionCode") !== -1) {
                            console.log(lineResult.exception.message);
                        }
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
    async componentWillUnmount() {
        this.bDestroyed = true;
        if (this.pRecognizer) {
            await (await this.pRecognizer).destroyContext();
            (await this.pCameraEnhancer).dispose();
            console.log('VideoRecognizer Component Unmount');
        }
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return (
            <div ref={this.elRef} style={{ width: "100%", height: "100%" }}></div>
        );
    }
}

export default VideoRecognizer;
