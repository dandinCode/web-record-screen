import { useRef, useState } from "react";
import WebCam from "../../components/WebCam";
import RecordButton from "../../components/RecordButton";
import DownloadButton from "../../components/DownloadButton";

function Home() {
    const videoElem = useRef(null);
    const webCam = useRef(null);

    let mediaRecorder;
    const [recordedChunks, setRecordedChunks] = useState([]);

    const [showDownloadButton, setShowDownloadButton] = useState(false);

    const handleDownload = (showDownloadButton) => {
      if (showDownloadButton === true) {
        setShowDownloadButton(true);
      }
    }

    const handleRecordedChunks = (value) =>{
      setRecordedChunks(value);
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
                videoElem={videoElem} 
                mediaRecorder={mediaRecorder} 
                handleDownload={handleDownload} 
                handleRecordedChunks={handleRecordedChunks} 
              />
              <WebCam webCamRef={webCam}/>
            </div>
            <div className="py-3">
              {showDownloadButton && <DownloadButton recordedChunks={recordedChunks} />}
            </div>            
          </div>
        </div>
      </>
    );
}

export default Home;