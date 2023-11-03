import React, { useRef, useState } from "react";
import "./App.css";
import atob from "atob";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [imageBase64Data, setImageBase64Data] = useState();

  let mediaStream = null;

  const openCamera = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error(error);
    }
  };

  const captureImage = async () => {
    if (mediaStream) {
      const context = canvasRef.current.getContext("2d");

      const centerX = (canvasRef.current.width - videoRef.current.width) / 2;
      const centerY = (canvasRef.current.height - videoRef.current.height) / 2;

      const frame = new Image();
      frame.src = "/frame.jpg";

      await new Promise((resolve) => {
        frame.onload = async () => {
          console.log("load image");
          context.drawImage(
            frame,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          context.drawImage(videoRef.current, 80, 38, centerX, centerY);
          resolve(true);
        };
      });

      const imageBase64 = canvasRef.current.toDataURL("image/png");

      setImageBase64Data(imageBase64);
    }
  };

  const b64toBlob = (b64Data, contentType = "image/png", sliceSize = 512) => {
    const byteCharacters = atob(b64Data.replace("data:image/png;base64,", ""));
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const handleFacebookShare = (TheImg) => {
    const bloburl = URL.createObjectURL(b64toBlob(TheImg));

    window.open(
      "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(bloburl)
    );
  };

  return (
    <div className="App">
      <button onClick={openCamera} className="capture-btn">
        Open Rear Camera
      </button>

      <video ref={videoRef} autoPlay className="my-5" />
      <button
        onClick={captureImage}
        className="capture-btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        type="button"
      >
        Capture Image
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Captured Image
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "500px" }}
              />
              <p>#NEW #NEWPROFILE #TOP #ENJOY</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="capture-btn"
                onClick={() => handleFacebookShare(imageBase64Data)}
              >
                POST
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
