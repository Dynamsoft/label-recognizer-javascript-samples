import React, {useEffect, useRef} from 'react';
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import './ImgRecognizer.css';

export default function ImgRecognizer() {
  let iptRef = useRef(null);
  let pImageRecognizer = useRef(null);

  useEffect(()=>{
    (async()=>{
      pImageRecognizer.current = pImageRecognizer.current || await LabelRecognizer.createInstance({runtimeSettings: "numberletter"});
    })();

    return async () => {
      if (pImageRecognizer.current) {
        pImageRecognizer.current.destroyContext();
        console.log('ImgDecode Component Unmount');
      }
    }
  },[])

  async function decodeImg(e) {
    const recognizer = await pImageRecognizer.current;
    let results = await recognizer.recognize(e.target.files[0]);
    for(let result of results){
      for(let line of result.lineResults) {
        alert(line.text);
        console.log(line.text);
      }
    }
    iptRef.current.value = '';
  }

  return (
    <div className="ImgDecode"><input type="file" ref={iptRef} onChange={decodeImg}/></div>
  )
}