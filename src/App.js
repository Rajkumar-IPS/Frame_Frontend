import React, { useRef, useState } from "react";
import "./App.css";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [video, setVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("loading: ", loading);

  const [imageBase64Data, setImageBase64Data] = useState();
  const [imageUrlFromBackend, setImageUrlFromBackend] = useState("");

  var mediaStream = null;

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
      setLoading(true);

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

      await fetch("https://merndemoapi.project-demo.info:3002/api/post_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      })
        .then((response) => response.json())
        .then((data) => {
          setImageUrlFromBackend(data?.data);
        })
        .catch((error) => {
          console.error(error);
        });

      setLoading(false);
    }
  };

  const hashtags = ["#SocialMedia"];

  const encodedHashtags = hashtags
    .map((tag) => `hashtag=${encodeURIComponent(tag)}`)
    .join("&");

  const handleFacebookShare = () => {
    window.open(
      "http://www.facebook.com/sharer.php?u=" +
        `https://merndemoapi.project-demo.info:3002/uploads/${imageUrlFromBackend}&hashtag=${encodedHashtags}`
    );
  };

  const handleInstagramShare = () => {
    window.open(
      "http://www.instagram.com/sharer.php?u=" +
        encodeURIComponent(
          `https://merndemoapi.project-demo.info:3002/uploads/${imageUrlFromBackend}&caption=${encodedHashtags}`
        )
    );
    // window.open(
    //   `instagram://library?AssetPath=${encodeURIComponent(imageUrlFromBackend)}`
    // );
  };

  const handleTwitterShare = () => {
    window.open(
      "https://twitter.com/intent/tweet?text=Check%20out%20this%20cool%20image&url=https%3A%2F%2Fexample.com%2Fyour-image.jpg"
    );
    // window.open(
    //   `instagram://library?AssetPath=${encodeURIComponent(imageUrlFromBackend)}`
    // );
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
            <div className="modal-body d-flex justify-content-center">
              <div
                class="spinner-border"
                style={{
                  width: "3rem",
                  height: "3rem",
                  display: !loading ? "none" : "flex",
                }}
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <div style={{ display: loading ? "none" : "block" }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    width: "100%",
                    height: "500px",
                  }}
                />
                <p>#SocialMedia</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={
                  loading
                    ? "btn btn-secondary btn-lg"
                    : "bg-transparent  border-0"
                }
                onClick={() => handleFacebookShare()}
                disabled={loading}
              >
                <img src="/facebook.png" style={{ height: "3rem" }} />
              </button>
              <button
                type="button"
                className={
                  loading
                    ? "btn btn-secondary btn-lg"
                    : "bg-transparent  border-0"
                }
                onClick={() => handleInstagramShare()}
                disabled={loading}
              >
                <img src="/instagram.png" style={{ height: "3rem" }} />
              </button>
              <button
                type="button"
                className={
                  loading
                    ? "btn btn-secondary btn-lg"
                    : "bg-transparent  border-0"
                }
                onClick={() => handleTwitterShare()}
                disabled={loading}
              >
                <img src="/twitter.png" style={{ height: "3rem" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
