import React, { useEffect, useState } from "react";
import { Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { v4 as uuidv4 } from "uuid";
import { useStores } from "../store/index";
import { useNavigate } from "react-router-dom";

function FaceLiveness({ faceLivenessAnalysis }) {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const { CommonStore } = useStores();
  const navigate = useNavigate();

  const endpoint = process.env.REACT_APP_ENV_API_URL || "";

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-API-KEY", "3646f320-aee6-452f-96f8-23718f3000b6");

  const newUUID = uuidv4();
  console.log(newUUID); // This will log a new UUID to the console

  const raw = JSON.stringify({
    reqToken: newUUID,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };


  useEffect(() => {
    const fetchCreateLiveness = async () => {
      try {
        console.log("Starting fetch...");
        const response = await fetch(
          `https://ssiapi-staging.smartfalcon.io/liveness/create`,
          requestOptions
        );
        console.log("Fetch response received...");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSessionId(data?.sessionId);
        CommonStore.setSessionId(data?.sessionId);
        console.log("Session ID:", CommonStore.sessionId);
        setLoading(false);
        console.log("Fetch success:", data);
      } catch (error) {
        console.error("Failed to create liveness session:", error);
        setLoading(false);
      }
    };
    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "/");
      myHeaders.append("Accept-Encoding", "gzip, deflate, br");
      myHeaders.append("Connection", "keep-alive");
      myHeaders.append("X-API-KEY", "3646f320-aee6-452f-96f8-23718f3000b6");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://ssiapi-staging.smartfalcon.io/liveness/result/${sessionId}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Failed to get liveness session results:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : sessionId!=null ? (
        <>
          <FaceLivenessDetector
            sessionId={sessionId}
            region="ap-south-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={(error) => {
              console.log(error);
            }}
          />
          <button
            onClick={() => navigate("/aadhaar")}
            style={{ cursor: "pointer" }}>
            Go To aadhar scan 
          </button>
        </>
      ) : (
        <p>Error: Unable to start the session. Please try again later.</p>
      )}
    </>
  );
}

export default FaceLiveness;
