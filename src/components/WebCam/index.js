import { useState } from "react";

function WebCam({webCamRef}){    
    const [webCamButton, setWebCamButton] = useState(false);

    const mediaDevices = navigator.mediaDevices;

    async function playWebCam() {
        try {
          const stream = await mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
  
          if (webCamRef.current) {
            webCamRef.current.srcObject = stream;  
            webCamRef.current.onloadedmetadata = async () => {
                webCamRef.current.play();

                try {
                await webCamRef.current.requestPictureInPicture();
                } catch (error) {
                console.log("Erro ao ativar o Picture-in-Picture: " + error);
                }
            };
          }
        } catch (error) {
          console.log("Erro ao acessar a webcam: " + error);
        }
    }
  
    function stopWebCam() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch((error) => {
        console.log("Erro ao sair do Picture-in-Picture: " + error);
        });
    }

    const stream = webCamRef.current ? webCamRef.current.srcObject : null; 

    if (stream) {
        stream.getTracks().forEach((track) => {
        if (track.readyState === "live") {
            track.stop(); 
        }
        });
        if (webCamRef.current) {
        webCamRef.current.srcObject = null;
        }
        console.log("Webcam totalmente parada.");
    } else {
        console.log("Nenhum stream ativo na webcam para parar.");
    }
    }

    function handleWebCamButton(value) {
        setWebCamButton(value);
        if(value === true){
            playWebCam();
        } else{
            stopWebCam();
        }
    }

    return(
        <>
            <label class="inline-flex items-center cursor-pointer ">
                <input type="checkbox" class="sr-only peer" onChange={()=>{handleWebCamButton(!webCamButton)}}/>
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 text-white">WebCam</span>
            </label>
        </>
    )
}

export default WebCam;