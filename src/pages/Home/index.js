import { useRef, useState, useEffect } from "react";
import WebCam from "../../components/WebCam";
import RecordButton from "../../components/RecordButton";

function Home() {
    const videoElem = useRef(null);
    const logElem = useRef(null);
    const downloadElem = useRef(null);
    const webCam = useRef(null);

    let mediaRecorder;
    const [recordedChunks, setRecordedChunks] = useState([]);

    const handleDownload = (showDownloadButton) => {
      if (showDownloadButton === true) downloadElem.current.style.display = "block";
    }

    const handleRecordedChunks = (value) =>{
      setRecordedChunks(value);
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
              <RecordButton 
                logElem={logElem} 
                videoElem={videoElem} 
                mediaRecorder={mediaRecorder} 
                handleDownload={handleDownload} 
                handleRecordedChunks={handleRecordedChunks} 
              />
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
