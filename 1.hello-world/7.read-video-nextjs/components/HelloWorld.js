import React from 'react';
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import VideoRecognizer from './VideoRecognizer';
import ImgRecognizer from './ImgRecognizer'

class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            libLoaded: false,
            bShowScanner: true,
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
            alert(ex.message);
            throw ex;
        }
    }
    showRecognizer = () => {
        this.setState({
            bShowRecognizer: true,
            bShowImgDecode: false
        });
    }

    showImgDecode = () => {
        this.setState({
            bShowRecognizer: false,
            bShowImgDecode: true
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
                        <button style={{backgroundColor: this.state.bShowImgDecode ? 'rgb(255,174,55)' : 'white'}} onClick={this.showImgDecode}>Image Recognizer</button>
                    </div> :
                    ''
                }
                {!this.state.libLoaded ? (<span style={{ fontSize: "x-large" }}>Loading Library...</span>) : ""}
                {this.state.bShowRecognizer ? (<VideoRecognizer></VideoRecognizer>) : ""}
                {this.state.bShowImgDecode ? (<ImgRecognizer></ImgRecognizer>) : ""}
            </div>
        );
    }
}
export default HelloWorld;