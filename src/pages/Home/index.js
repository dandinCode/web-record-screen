import { useRef, useState, useEffect } from "react";
import WebCam from "../../components/WebCam";

function Home() {
    const videoElem = useRef(null);
    const logElem = useRef(null);
    const downloadElem = useRef(null);
    const webCam = useRef(null);

    let mediaRecorder;
    let recordedChunks = [];

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

    const customConsoleError = (msg) => {
      if (logElem.current) {
        logElem.current.textContent = `${logElem.current.textContent}\nError: ${msg}`;
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
        customConsoleError(err);
      }
    }

    function stopCapture() {
      if (!videoElem.current) return;

      let tracks = videoElem.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoElem.current.srcObject = null;
      
      if (mediaRecorder) mediaRecorder.stop(); // Stop recording

      // Show download button
      if (downloadElem.current) downloadElem.current.style.display = "block";
    }

    function startRecording(stream) {
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.start();
      console.log("Recording started.");
    }

    function downloadRecording() {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.style.display = "none";
      a.href = url;
      a.download = "screen-recording.mp4";

      document.body.appendChild(a);
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("Recording downloaded.");
    }

   

    return (
      <>
        <div className="flex justify-center" >
          <div  className="text-white">
            <h1 className="flex justify-center font-serif text-5xl py-4">Gravador de tela</h1>

            <video
              ref={videoElem}
              muted
              autoPlay
              style={{ width: "600px"}}
              className="bg-gray-500"
            ></video>
            <br />
            <video
              ref={webCam}
              controls
              muted
              autoPlay
              hidden
              style={{ width: "100px", border: "1px solid black" }}
            ></video>
            <br />
            <div class="flex justify-between">
              <button className="p-1 bg-blue-950" onClick={startCapture}>
                Gravar tela
              </button>
              <button className="p-1 bg-blue-950" onClick={stopCapture}>
                Parar gravação
              </button>
              <br />
              <WebCam webCamRef={webCam}/>
            </div>
            
            <br />
            <button
              className="p-1 bg-blue-950"
              ref={downloadElem}
              style={{ display: "none" }}
              onClick={downloadRecording}
            >
              Baixar gravação
            </button>
            <br />
            <pre ref={logElem}></pre>
          </div>
        </div>
      </>
    );
}

export default Home;
