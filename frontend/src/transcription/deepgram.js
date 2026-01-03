const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

export function createDeepgramSocket(onTranscript) {
  const socket = new WebSocket(
    "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&interim_results=true",
    ["token", DEEPGRAM_API_KEY]
  );

  socket.onopen = () => {
    console.log(" Deepgram connected");
  };

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);

    const transcript =
      data.channel?.alternatives?.[0]?.transcript;

    if (transcript) {
      onTranscript(transcript, data.is_final);
    }
  };

  socket.onerror = (err) => {
    console.error(" Deepgram error", err);
  };

  socket.onclose = () => {
    console.log(" Deepgram disconnected");
  };

  return socket;
}
