import { useState } from 'react';
import './App.css';
import reactLogo from './assets/logo.svg';
import VideoRecognizer from './components/VideoRcognizer/VideoRecognizer';
import ImageRecognizer from './components/ImageRecognizer/ImageRecognizer';

function App() {
  const [mode, setMode] = useState("video");
  return (
    <div className='App'>
      <div className='title'>
        <h2 className='title-text'>Hello World for React</h2>
        <img className='title-logo' src={reactLogo} alt="logo"></img>
      </div>
      <div className='top-btns'>
        <button onClick={()=>{setMode("video")}} style={{backgroundColor: mode === "video" ? "rgb(255, 174, 55)" : "#fff"}}>VideoRecognizer</button>
        <button onClick={()=>{setMode("image")}} style={{backgroundColor: mode === "image" ? "rgb(255, 174, 55)" : "#fff"}}>ImageRecognizer</button>
      </div>
      { mode === "video" ? <VideoRecognizer /> : <ImageRecognizer /> }
    </div>
  );
}

export default App;
