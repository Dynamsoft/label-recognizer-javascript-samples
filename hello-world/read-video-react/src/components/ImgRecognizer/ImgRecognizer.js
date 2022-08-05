import React, { Component } from 'react'
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import './ImgRecognizer.css'

export default class ImgRecognizer extends Component {
  constructor(props) {
    super(props);
    this.pRecognizer = null;
    this.iptRef = React.createRef();
  }

  async componentDidMount() {
    await (this.pRecognizer = LabelRecognizer.createInstance({runtimeSettings: "numberletter"}));
  }

  recognizeImg = async (e) => {
    try {
      const recognizer = await this.pRecognizer;
      let results = await recognizer.recognize(e.target.files[0]);
      for(let result of results){
        for(let line of result.lineResults) {
          alert(line.text);
          console.log(line.text);
        }
      }
      this.iptRef.current.value = '';
    } catch(ex) {
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

  async componentWillUnmount() {
    if (this.pRecognizer) {
      (await this.pRecognizer).destroyContext();
      console.log('ImgRecognize Component Unmount');
    }
  }

  render() {
    return (
      <div className="recognizeImg"><input type="file" ref={this.iptRef} onChange={this.recognizeImg}/></div>
    )
  }
}