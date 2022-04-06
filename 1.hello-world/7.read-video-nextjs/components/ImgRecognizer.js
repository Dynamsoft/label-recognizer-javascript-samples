import React, { Component } from 'react'
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";

export default class ImgDecode extends Component {
  constructor(props) {
    super(props);
    this.pRecognizer = null;
    this.iptRef = React.createRef();
  }

  async componentDidMount() {
    await (this.pRecognizer = LabelRecognizer.createInstance({runtimeSettings: "numberletter"}));
  }

  decodeImg = async (e) => {
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
      console.error(ex);
    }
  }

  async componentWillUnmount() {
    if (this.pRecognizer) {
      (await this.pRecognizer).destroyContext();
      console.log('ImgDecode Component Unmount');
    }
  }

  render() {
    return (
      <div className="ImgDecode"><input type="file" ref={this.iptRef} onChange={this.decodeImg}/></div>
    )
  }
}