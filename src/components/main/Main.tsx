import React, {useEffect, useState} from 'react';
import ReactSpeedometer from "react-d3-speedometer"
import hubbleIQLib from "../../libs/hubbleIQLib";
import { ICompleteData, IConnectionMsg, IUploadAndDownloadData } from "../../interfaces/data.interfaces";
import './main.scss'

function Main() {
  const [dSpeed, setDSpeed] = useState(0);
  const [uSpeed, setUSpeed] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [latency, setLatency] = useState(0);
  const [packetLoss, setPacketLoss] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [stability, setSstability] = useState(0);
  const [connectionMsg, setConnectionMsg] = useState('');
  const [connectionMsgHeader, setConnectionMsgHeader] = useState('');
  const [statusBackgroundColor, setStatusBackgroundColor] = useState('');

  useEffect(() => {
    hubbleIQLib.on("connection-status", (status: string) => {
      console.log('🚀 Connection-status data:', status);
      setConnectionStatus(status);
    });

    hubbleIQLib.on("upload-measurement", (data: IUploadAndDownloadData) => {
      console.log('🚀 Upload-measurement data:', data);
      setUSpeed(data?.ClientToServerSpeed);
    });

    hubbleIQLib.on("download-measurement", (data: IUploadAndDownloadData) => {
      console.log('🚀 Download-measurement data:', data);
      setDSpeed(data.ServerToClientSpeed);
    });

    hubbleIQLib.on("complete", (data: ICompleteData) => {
      console.log('🚀 Complete data:', data);
      setJitter(data?.jitter);
      setLatency(data?.latency);
    });

    hubbleIQLib.on("packet-loss", (data: number) => {
      console.log("🚀 Packet-loss data:", data);
      setPacketLoss(data);
    });

    hubbleIQLib.on("connection-stability", (data: number) => {
      setSstability(data);
    });
    hubbleIQLib.on("connection-msg", (data: IConnectionMsg) => {
      setStatusBackgroundColor(data.color);
      setConnectionMsg(data.msg);
      setConnectionMsgHeader(data.header);
    });
  }, [jitter, latency]);

  async function callPocketLossTest() {
    await hubbleIQLib.calculatePacketLoss();
  }
  async function callInetConnectionTest() {
    await hubbleIQLib.checkInternetConnection();
  }
  async function startTest() {
    if (jitter && latency) {
      await hubbleIQLib.stop();
    }
    await hubbleIQLib.run();
  }

  const connectionMsgHeaderStyles = {
    backgroundColor: statusBackgroundColor,
  };
  return (
    <div className="layout">
      <div className="layout-greeting">
        <h1>Your speed test results are here!</h1>
      </div>
      <div className="layout-content">
        <div className="layout-content-buttons">
          <button type="button" className="run-test-btn" onClick={callPocketLossTest}>Check Pocket Loss</button>
          <button type="button" className="run-test-btn" onClick={callInetConnectionTest}>Check Internet Connection</button>
          <button type="button" className="run-test-btn" onClick={startTest}>Start Test</button>
        </div>
        <div className="test-connection-status test-result">
          <p>Stability: {stability} ms / Connection status: <span>{connectionStatus}</span></p>
        </div>
        {connectionMsgHeader && connectionMsg && (
          <div style={connectionMsgHeaderStyles} className="test-connection-result">
            <h3>{connectionMsgHeader}</h3>
            <h4>{connectionMsg}</h4>
          </div>
        )}
      <div className="test-packet-loss test-result">
          <p>Packet loss</p>
          <span>{packetLoss} %</span>
        </div>
        <div className="test-complete test-result">
          <p>
            Jitter: {jitter} ms / Latency: {latency} ms
          </p>
          <div className="speedometer-wrapper">
            <div className="speedometer">
              <span>Upload speed (Mb/s)</span>
              <ReactSpeedometer maxValue={1000} value={uSpeed} ringWidth={20}/>
            </div>
            <div className="speedometer download">
              <span>Download speed (Mb/s)</span>
              <ReactSpeedometer maxValue={1000} value={dSpeed} ringWidth={20}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
