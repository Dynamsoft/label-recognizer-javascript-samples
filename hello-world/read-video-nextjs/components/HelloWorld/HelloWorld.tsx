"use client"

import React, { useState } from "react";
import VideoRecognizer from "../VideoRecognizer/VideoRecognizer";
import ImageRecognizer from "../ImageRecognizer/ImageRecognizer";
import "../../cvr"; // import side effects. The license, engineResourcePath, so on.
import "./HelloWorld.css";

function HelloWorld() {
  const [mode, setMode] = useState("video");

  return (
    <div className='div-hello-world'>
      <div className='title'>
        <h2 className='title-text'>Hello World for Nextjs</h2>
        <img className='title-logo' src="/next.svg" alt="logo"></img>
      </div>
      <div className='top-btns'>
        <button onClick={()=>{setMode("video")}} style={{backgroundColor: mode === "video" ? "rgb(255, 174, 55)" : "#fff"}}>VideoRecognizer</button>
        <button onClick={()=>{setMode("image")}} style={{backgroundColor: mode === "image" ? "rgb(255, 174, 55)" : "#fff"}}>ImageRecognizer</button>
      </div>
      { mode === "video" ? <VideoRecognizer /> : <ImageRecognizer /> }
    </div>
  );
}

export default HelloWorld;
