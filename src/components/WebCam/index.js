import { useRef } from "react";

function WebCam({webCamRef}){    
    const webCam = webCamRef;
    const mediaDevices = navigator.mediaDevices;

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
          console.log("Webcam totalmente parada.");
        } else {
          console.log("Nenhum stream ativo na webcam para parar.");
        }
      }
    return(
        <>
            <button className="p-1 m-2 bg-blue-950" onClick={playWebCam}>
                Abrir webCam
            </button>
            <button className="p-1 m-2 bg-blue-950" onClick={stopWebCam}>
                Parar webcam
            </button>
        </>
    )
}

export default WebCam;