import './HelloWorld.css';
import reactLogo from '../logo.svg';
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";
import React from 'react';
import VideoRecognizer from './VideoRecognizer';
import ImgRecognizer from './ImgRecognizer';

class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            libLoaded: false,
            bShowRecognizer: true,
            bShowImgDecode: false, 
        };
    }
    async componentDidMount() {
        try {
            await LabelRecognizer.loadWasm();
            this.setState(state => {
                state.libLoaded = true;
                return state;
            }, () => {
                this.showRecognizer();
            });
        } catch (ex) {
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
            <div className="helloWorld">
                <h1>Hello World for React<img src={reactLogo} className="App-logo" alt="logo" /></h1>
                {
                    this.state.libLoaded ? 
                    <div className="btn-group">
                        <button style={{marginRight: '10px', backgroundColor: this.state.bShowRecognizer ? 'rgb(255,174,55)' : 'white'}} onClick={this.showRecognizer}>Video Recognizer</button>
                        <button style={{backgroundColor: this.state.bShowImgDecode ? 'rgb(255,174,55)' : 'white'}} onClick={this.showImgDecode}>Image Recognizer</button>
                    </div> :
                    ''
                }
                <div id="UIElement">
                    {!this.state.libLoaded ? (<span style={{ fontSize: "x-large" }}>Loading Library...</span>) : ""}
                    {this.state.bShowRecognizer ? (<VideoRecognizer></VideoRecognizer>) : ""}
                    {this.state.bShowImgDecode ? (<ImgRecognizer></ImgRecognizer>) : ""}
                </div>
            </div>
        );
    }
}
export default HelloWorld;