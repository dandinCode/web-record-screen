import { useRef, useState, useEffect } from "react";

function Home() {
    const videoElem = useRef(null);
    const logElem = useRef(null);
    const downloadElem = useRef(null);
    const webCam = useRef(null);

    let mediaRecorder;
    let recordedChunks = [];

    const mediaDevices = navigator.mediaDevices;

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
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.style.display = "none";
      a.href = url;
      a.download = "screen-recording.webm";

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

    async function playWebCam() {
      // Acessa a webcam e o áudio do usuário
      try {
        const stream = await mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Atribui o stream de vídeo à webcam
        if (webCam.current) {
          webCam.current.srcObject = stream;

          // Espera o vídeo carregar e iniciar
          webCam.current.onloadedmetadata = async () => {
            webCam.current.play();

            // Solicita o Picture-in-Picture assim que o vídeo iniciar
            try {
              await webCam.current.requestPictureInPicture();
            } catch (error) {
              customConsoleError("Erro ao ativar o Picture-in-Picture: " + error);
            }
          };
        }
      } catch (error) {
        customConsoleError("Erro ao acessar a webcam: " + error);
      }
    }

    function stopWebCam() {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch((error) => {
          customConsoleError("Erro ao sair do Picture-in-Picture: " + error);
        });
      }

      const stream = webCam.current ? webCam.current.srcObject : null; // Acessa o stream da webcam

      if (stream) {
        // Para todas as trilhas (tanto de vídeo quanto de áudio)
        stream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop(); // Para cada trilha ativa (live)
          }
        });

        // Remove o stream do elemento de vídeo
        if (webCam.current) {
          webCam.current.srcObject = null;
        }
        customConsoleLog("Webcam totalmente parada.");
      } else {
        customConsoleLog("Nenhum stream ativo na webcam para parar.");
      }
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
        <button className="p-1 m-2 bg-blue-950" onClick={playWebCam}>
          Abrir webCam
        </button>
        |
        <button className="p-1 m-2 bg-blue-950" onClick={stopWebCam}>
          Parar webcam
        </button>
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
