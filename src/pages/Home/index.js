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

    const customConsoleLog = (msg) => {
      if (logElem.current) {
        logElem.current.textContent = `${logElem.current.textContent}\n${msg}`;
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

        dumpOptionsInfo(screenStream);
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
      customConsoleLog("Recording started.");
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

      customConsoleLog("Recording downloaded.");
    }

    function dumpOptionsInfo(screenStream) {
      const videoTrack = screenStream.getVideoTracks()[0];

      customConsoleLog("Track settings:");
      customConsoleLog(JSON.stringify(videoTrack.getSettings(), null, 2));
      customConsoleLog("Track constraints:");
      customConsoleLog(JSON.stringify(videoTrack.getConstraints(), null, 2));
    }

    return (
      <>
        <h2>Gravador de tela</h2>

        <video
          ref={videoElem}
          muted
          autoPlay
          style={{ width: "600px", border: "1px solid black" }}
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
        <button className="p-1 m-2 bg-blue-950" onClick={startCapture}>
          Gravar tela
        </button>
        |
        <button className="p-1 m-2 bg-blue-950" onClick={stopCapture}>
          Parar gravação
        </button>
        <br />
        <WebCam webCamRef={webCam}/>
        <br />
        <button
          className="p-1 m-2 bg-blue-950"
          ref={downloadElem}
          style={{ display: "none" }}
          onClick={downloadRecording}
        >
          Baixar gravação
        </button>
        <br />
        <pre ref={logElem}></pre>
      </>
    );
}

export default Home;
