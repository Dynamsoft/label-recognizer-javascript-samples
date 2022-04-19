import './HelloWorld.css';
import {useEffect, useState} from 'react';
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import VideoRecognizer from '../VideoRecognizer/VideoRecognizer';
import ImgRecognizer from '../ImgRecognizer/ImgRecognizer';

export default function HelloWorld() {
  const [libLoaded, setLibLoaded] = useState(false);
  const [bShowRecognizer, setBShowRecognizer] = useState(true);
  const [bShowImgDecode, setBShowImgDecode] = useState(false);

  useEffect(()=>{
    (async() => {
      await LabelRecognizer.loadWasm();
      // setLibLoaded(true); 
      showRecognizer();
    })();
  }, [])

  function changeLibloaded() {
    setLibLoaded(true);
  }

  function showRecognizer() {
    setBShowRecognizer(true);
    setBShowImgDecode(false);
  }

  function showImgDecode() {
    setBShowRecognizer(false);
    setBShowImgDecode(true);
  }

  return (
    <div className="helloWorld">
      <h1>Hello World for React-Hooks</h1>
      {
          libLoaded ? 
          <div className="btn-group">
              <button style={{marginRight: '10px', backgroundColor: bShowRecognizer ? 'rgb(255,174,55)' : 'white'}} onClick={showRecognizer}>Video Recognizer</button>
              <button style={{backgroundColor: bShowImgDecode ? 'rgb(255,174,55)' : 'white'}} onClick={showImgDecode}>Image Recognizer</button>
          </div> : ""
      }
      <div id="UIElement">
          {!libLoaded ? (<span style={{ fontSize: "x-large" }}>Loading Library...</span>) : ""}
          {bShowRecognizer && <VideoRecognizer changeLibloaded={changeLibloaded}></VideoRecognizer>}
          {bShowImgDecode && <ImgRecognizer></ImgRecognizer>}
      </div>
    </div>
  )
}