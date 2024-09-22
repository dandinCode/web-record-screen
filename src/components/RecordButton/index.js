import { useState } from "react";

function RecordButton({logElem, videoElem, mediaRecorder, handleDownload, handleRecordedChunks}){
    const [playButton, setPlayButton] = useState(false);
    
    // Options for getDisplayMedia() with both video and audio
    const displayMediaOptions = {
        video: {
          displaySurface: "window", // Can also be "browser" or "monitor"
        },
        audio: false, // Temporarily disable audio here, will add microphone separately
      };
  
      const audioOptions = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      };
  
      async function startCapture() {
        if (!logElem.current) return;
        logElem.current.textContent = "";
  
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
          const audioStream = await navigator.mediaDevices.getUserMedia(audioOptions); // Capture microphone audio
  
          // Combine screen and audio streams
          const combinedStream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);
  
          if (videoElem.current) {
            videoElem.current.srcObject = combinedStream;
            startRecording(combinedStream); // Start recording with combined streams
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
        
        if (mediaRecorder) mediaRecorder.stop(); // Stop recording
        console.log("Recording stoped.");
        setPlayButton(false);
        // Show download button
        handleDownload(true)
        
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
        console.log(value)        
        if(value === true){
            startCapture();
        } else{
            stopCapture();
        }
      }

    return (
        <>
        <div>
            <button class="rounded-full px-3 py-1 bg-blue-950" onClick={()=>{handleRecordButton(!playButton)}}>
                {playButton === false ? <>Gravar tela</> : <>Parar gravação</>}
            </button>
            
        </div>
        </>
    )
}

export default RecordButton;