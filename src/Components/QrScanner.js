import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QrScanner.css"; // Import custom CSS

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const html5QrCode = useRef(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        // Request camera permission
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setPermissionGranted(true);
      } catch (error) {
        console.error("Camera permission denied", error);
        setPermissionGranted(false);
      }
    };

    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (permissionGranted) {
      html5QrCode.current = new Html5Qrcode("qr-reader");
      html5QrCode.current
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 300, height: 300 }, // Specify the size of the QR box
            disableFlip: true,
          },
          onScanSuccess,
          onScanError
        )
        .catch((error) => {
          console.error("Error starting QR scanner:", error);
        });

      return () => {
        if (html5QrCode.current) {
          html5QrCode.current
            .stop()
            .then(() => {
              html5QrCode.current.clear();
            })
            .catch((err) => console.error("Failed to clear html5Qrcode", err));
        }
      };
    }
  }, [permissionGranted, onScanSuccess, onScanError]);

  return (
    <>
      {!permissionGranted ? (
        <div className="permission-message">
          <p>Please allow camera access to scan QR codes.</p>
        </div>
      ) : (
        <div id="qr-reader" className="qr-scanner"></div>
      )}
    </>
  );
};

export default QRScanner;
