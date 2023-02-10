import { useEffect, useRef, MutableRefObject, ChangeEvent } from "react";
import { LabelRecognizer } from "dynamsoft-label-recognizer";
import "./ImageRecognizer.css";

function ImageRecognizer() {
    const iptRef: MutableRefObject<HTMLInputElement|null> = useRef(null);
    const resRef: MutableRefObject<HTMLDivElement|null> = useRef(null);
    const dlr: MutableRefObject<Promise<LabelRecognizer>|null> = useRef(null);

    useEffect((): any => {
        dlr.current = LabelRecognizer.createInstance({runtimeSettings: "mrz"});

        return async () => {
            (await dlr.current)!.destroyContext();
            console.log('ImageRecognizer Component Unmount');
        }
    }, []);

    const recognizeImg = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            resRef.current!.innerText = "";
            const recognizer = await dlr.current;
            const results = await recognizer!.recognize(e.target.files![0]);
            const res = [];
            for(let result of results){
                for(let line of result.lineResults) {
                    console.log(line.text);
                    res.push(line.text);
                } 
            }
            resRef.current!.innerText = res.join("\n");
            iptRef.current!.value = '';
        } catch(ex:any) {
            let errMsg: string;
            if (ex.message.includes("network connection error")) {
                errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
            } else {
                errMsg = ex.message||ex;
            }
            console.error(errMsg);
            alert(errMsg);
        }
    }

    return (
        <div className="recognize-img">
            <div className="img-ipt"><input type="file" ref={ iptRef } onChange={ recognizeImg }/></div>
            <div className="result-area" ref={ resRef }></div>
        </div>
    )
}

export default ImageRecognizer;