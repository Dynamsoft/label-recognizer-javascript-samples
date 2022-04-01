import React, { Component } from 'react'
import { LabelRecognizer } from "keillion-dynamsoft-label-recognizer";

export default class ImgDecode extends Component {
  constructor(props) {
    super(props);
    this.pReader = null;
    this.reader = null;
    this.iptRef = React.createRef();
  }

  async componentDidMount() {
    this.reader = await (this.pReader = LabelRecognizer.createInstance({runtimeSettings: "letter"}));
  }

  decodeImg = async (e) => {
    try {
      let results = await this.reader.recognize(e.target.files[0]);
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
    if (this.pReader) {
      (await this.pReader).destroyContext();
      console.log('ImgDecode Component Unmount');
    }
  }

  render() {
    return (
      <div className="ImgDecode"><input type="file" ref={this.iptRef} onChange={this.decodeImg}/></div>
    )
  }
}