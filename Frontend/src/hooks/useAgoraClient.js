// src/hooks/useAgoraClient.js
import AgoraRTC from "agora-rtc-sdk-ng";

export const createAgoraClient = () => {
  return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
};
