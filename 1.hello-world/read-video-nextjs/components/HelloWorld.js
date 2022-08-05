import React from 'react';
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import VideoRecognizer from './VideoRecognizer';
import ImgRecognizer from './ImgRecognizer'

class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            libLoaded: false,
            bShowImgRecognize: true,
            bShowRecognizer: false
        };
    }
    async componentDidMount() {
        try {
            //Load the library on page load to speed things up.
            await LabelRecognizer.loadWasm();
            this.setState(state => {
                state.libLoaded = true;
                return state;
            }, () => {
                this.showRecognizer();
            });
        } catch (ex) {
            let errMsg;
            if (ex.message.includes("network connection error")) {
                errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
            } else {
                errMsg = ex.message||ex;
            }
            console.error(errMsg);
            alert(errMsg);
        }
    }
    showRecognizer = () => {
        this.setState({
            bShowRecognizer: true,
            bShowImgRecognize: false
        });
    }

    showImgRecognize = () => {
        this.setState({
            bShowRecognizer: false,
            bShowImgRecognize: true
        });
    }
    render() {
        return (
            <div className="helloWorld" style={{ height: "100%", width: "100%" }}>
                <h1>Hello World for Nextjs</h1>
                {
                    this.state.libLoaded ? 
                    <div className="btn-group">
                        <button style={{marginRight: '10px', backgroundColor: this.state.bShowRecognizer ? 'rgb(255,174,55)' : 'white'}} onClick={this.showRecognizer}>Video Recognizer</button>
                        <button style={{backgroundColor: this.state.bShowImgRecognize ? 'rgb(255,174,55)' : 'white'}} onClick={this.showImgRecognize}>Image Recognizer</button>
                    </div> :
                    ''
                }
                {!this.state.libLoaded ? (<span style={{ fontSize: "x-large" }}>Loading Library...</span>) : ""}
                {this.state.bShowRecognizer ? (<VideoRecognizer></VideoRecognizer>) : ""}
                {this.state.bShowImgRecognize ? (<ImgRecognizer></ImgRecognizer>) : ""}
            </div>
        );
    }
}
export default HelloWorld;