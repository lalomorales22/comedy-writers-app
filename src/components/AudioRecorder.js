import React, { useState, useRef } from 'react';

function AudioRecorder({ addJoke }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [keywords, setKeywords] = useState('');
  const mediaRecorder = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();

    const audioChunks = [];
    mediaRecorder.current.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.current.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    });

    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const saveRecording = () => {
    if (audioURL && keywords) {
      addJoke({
        type: 'audio',
        content: audioURL,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        timestamp: new Date().toISOString()
      });
      setAudioURL('');
      setKeywords('');
    }
  };

  return (
    <div className="audio-recorder">
      {!isRecording && !audioURL && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {isRecording && (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {audioURL && (
        <>
          <audio src={audioURL} controls />
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Keywords (comma-separated)"
          />
          <button onClick={saveRecording}>Save Recording</button>
        </>
      )}
    </div>
  );
}

export default AudioRecorder;