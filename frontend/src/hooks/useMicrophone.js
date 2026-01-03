import { useRef, useState } from "react";
import { float32ToInt16 } from "../audio/pcm";
import { createDeepgramSocket } from "../transcription/deepgram";

export function useMicrophone() {
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const deepgramSocketRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      deepgramSocketRef.current = createDeepgramSocket(
        (text, isFinal) => {
          if (isFinal) {
            setFinalTranscript((prev) =>
              prev ? prev + " " + text : text
            );
            setInterimTranscript("");
          } else {
            setInterimTranscript(text);
          }

          console.log("Transcript:", text, "final:", isFinal);
        }
      );

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (event) => {
        const float32Data = event.inputBuffer.getChannelData(0);
        const int16Data = float32ToInt16(float32Data);

        if (
          deepgramSocketRef.current &&
          deepgramSocketRef.current.readyState === WebSocket.OPEN
        ) {
          deepgramSocketRef.current.send(int16Data.buffer);
        }
      };

      setIsRecording(true);
    } catch (err) {
      console.error("Microphone permission denied", err);
    }
  };

  const clearTranscript = () => {
  setFinalTranscript("");
  setInterimTranscript("");
};

const stopRecording = () => {
  processorRef.current?.disconnect();
  audioContextRef.current?.close();

  streamRef.current?.getTracks().forEach((track) => track.stop());

  deepgramSocketRef.current?.close();
  deepgramSocketRef.current = null;

  setIsRecording(false);
};

  return {
    startRecording,
    stopRecording,
    isRecording,
    finalTranscript,
    interimTranscript,
    clearTranscript
  };
}
