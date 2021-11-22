import DLR from "../dlr";
import DCE from "../dce";
import React from 'react';
import './LabelRecognizer.css';

class LabelRecognizer extends React.Component {
    constructor(props) {
        super(props);
        this.bDestroyed = false;
        this.pRecognizer = null;
        this.pCameraEnhancer = null;
        this.elRef = React.createRef();
    }
    async componentDidMount() {
        try {
            let cameraEnhancer = await (this.pCameraEnhancer = this.pCameraEnhancer || DCE.createInstance());
            let recognizer = await (this.pRecognizer = this.pRecognizer || DLR.createInstance({
                runtimeSettings: "video-letter"
            }))
            await cameraEnhancer.setUIElement(DLR.defaultUIElementURL);
            recognizer.cameraEnhancer = cameraEnhancer;

            await recognizer.startScanning(true);

            if (this.bDestroyed) {
                recognizer.destroy();
                return;
            }

            recognizer.onFrameRead = results => {
                for (let result of results) {
                    for (let lineResult of result.lineResults) {
                        console.log(lineResult.text);
                        this.props.appendMessage({ format: lineResult.format, text: lineResult.text, type: "result" });
                        if (lineResult.text.indexOf("Attention(exceptionCode") !== -1) {
                            this.props.appendMessage({ msg: lineResult.exception.message, type: "error" });
                        }
                    }
                }
            };

            recognizer.onUniqueRead = (txt, result) => {
                alert(txt);
                console.log("Unique Code Found: " + result);
            }

            // this.elRef.current.appendChild(recognizer.camearEnhancer.setUIElement());
            document.getElementsByClassName("dce-btn-close")[0].style.display = "none";
            
        } catch (ex) {
            this.props.appendMessage({ msg: ex.message, type: "error" });
            console.error(ex);
        }
    }
    async componentWillUnmount() {
        this.bDestroyed = true;
        if (this.pRecognizer) {
            (await this.pRecognizer).destroy();
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

export default LabelRecognizer;
