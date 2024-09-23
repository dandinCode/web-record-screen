import { useState } from "react";
import playIconSVG from "../../assets/icons/play.svg";
import pauseIconSVG from "../../assets/icons/pause.svg"

function RecordButton({videoElem, mediaRecorder, handleDownload, handleRecordedChunks}){
    const [playButton, setPlayButton] = useState(false);
    
    
    const displayMediaOptions = {
        video: {
          displaySurface: "window", 
        },
        audio: false, 
      };
  
      const audioOptions = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      };
  
      async function startCapture() {     
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
          const audioStream = await navigator.mediaDevices.getUserMedia(audioOptions);   
          
          const combinedStream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);
          if (videoElem.current) {
            videoElem.current.srcObject = combinedStream;
            startRecording(combinedStream); 
          }
        } catch (err) {
          console.log(err);
        }
      }
  
      function stopCapture() {
        if (!videoElem.current) return;
  
        let tracks = videoElem.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoElem.current.srcObject = null;
        
        if (mediaRecorder) mediaRecorder.stop(); 
        console.log("Recording stoped.");
        setPlayButton(false);
        // Show download button
        handleDownload(true);        
      }
  
      function startRecording(stream) {
        let recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);
  
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
            handleRecordedChunks(recordedChunks)
          }
        };
  
        mediaRecorder.start();
        console.log("Recording started.");
        setPlayButton(true);
      }

      function handleRecordButton (value){
        if(value === true){
            startCapture();
        } else{
            stopCapture();
        }
      }

    return (
        <>
        <div>
            <button class="flex items-center justify-center rounded-full px-3 py-1 bg-blue-950 " onClick={()=>{handleRecordButton(!playButton)}}>
                {playButton === false ? 
                <>
                  <span className="inline-block align-middle"> 
                      <img src={playIconSVG} style={{ width: "18px"}} /> 
                    </span> 
                    <span className="ps-1">
                      Gravar tela
                  </span>
                </> : 
                <>
                  <span className=""> 
                      <img src={pauseIconSVG} style={{ width: "18px"}} /> 
                    </span> 
                    <span className="ps-1 ">
                      Parar gravação
                  </span>
                </>}
            </button>
            
        </div>
        </>
    )
}

export default RecordButton;