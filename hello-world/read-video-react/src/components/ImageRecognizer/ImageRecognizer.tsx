import { useEffect, useRef, MutableRefObject } from "react";
import type { TextLineResultItem } from "@dynamsoft/dynamsoft-label-recognizer"
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import "./ImageRecognizer.css";

function ImageRecognizer() {
    const iptRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const resRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const pRouter: MutableRefObject<Promise<CaptureVisionRouter> | null> = useRef(null);

    useEffect((): any => {
        pRouter.current = CaptureVisionRouter.createInstance();

        return async () => {
            (await pRouter.current)!.dispose();
            console.log('ImageRecognizer Component Unmount');
        }
    }, []);

    const captureImage = async (e: any) => {
        try {
            resRef.current!.innerText = "";
            const router = await pRouter.current;
            const results = await router!.capture(e.target.files[0]);
            const res = [];
            for (let result of results.items) {
                console.log((result as TextLineResultItem).text);
                res.push((result as TextLineResultItem).text);
            }
            resRef.current!.innerText = res.join("\n");
            iptRef.current!.value = '';
        } catch (ex: any) {
            let errMsg = ex.message || ex;
            console.error(errMsg);
            alert(errMsg);
        }
    }

    return (
        <div className="capture-img">
            <div className="img-ipt"><input type="file" ref={iptRef} onChange={captureImage} /></div>
            <div className="result-area" ref={resRef}></div>
        </div>
    )
}

export default ImageRecognizer;