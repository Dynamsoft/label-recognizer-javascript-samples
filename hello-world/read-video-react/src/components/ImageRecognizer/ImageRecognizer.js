import { useEffect, useRef } from "react";
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import "./ImageRecognizer.css";

function ImageRecognizer() {
    const iptRef = useRef(null);
    const resRef = useRef(null);
    const dlr = useRef(null);

    useEffect(() => {
        dlr.current = LabelRecognizer.createInstance({runtimeSettings: "mrz"});

        return async () => {
            (await dlr.current).destroyContext();
            console.log('ImgRecognizer Component Unmount');
        }
    }, []);

    const recognizeImg = async (e) => {
        resRef.current.innerText = "";
        const recognizer = await dlr.current;
        const results = await recognizer.recognize(e.target.files[0]);
        const res = [];
        for(let result of results){
            for(let line of result.lineResults) {
                console.log(line.text);
                res.push(line.text);
            } 
        }
        resRef.current.innerText = res.join("\n");
        iptRef.current.value = '';
    }

    return (
        <div className="recognize-img">
            <div className="img-ipt"><input type="file" ref={ iptRef } onChange={ recognizeImg }/></div>
            <div className="result-area" ref={ resRef }></div>
        </div>
    )
}

export default ImageRecognizer;