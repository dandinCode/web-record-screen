import downloadIconSVG from "../../assets/icons/download.svg";

function DownloadButton({recordedChunks}) {
    function downloadRecording() {
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
  
        a.style.display = "none";
        a.href = url;
        a.download = "screen-recording.mp4";
  
        document.body.appendChild(a);
        a.click();
  
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
  
        console.log("Recording downloaded.");
    }

    return (
        <>
            <button
              className="flex items-center justify-center rounded-full px-3 py-1 bg-blue-950"
              onClick={downloadRecording}
            >
                <span className=""> 
                    <img src={downloadIconSVG} style={{ width: "20px"}} /> 
                </span> 
                <span className="ps-1">
                    Baixar gravação
                </span>
            </button>
        </>
    )
}

export default DownloadButton;