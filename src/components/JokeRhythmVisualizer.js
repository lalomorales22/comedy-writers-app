import React, { useState, useEffect, useRef } from 'react';

function JokeRhythmVisualizer({ jokeText }) {
  const [rhythm, setRhythm] = useState([]);
  const [analysis, setAnalysis] = useState({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const audioRef = useRef(null);
  const rhythmDisplayRef = useRef(null);

  useEffect(() => {
    visualizeRhythm(jokeText);
  }, [jokeText]);

  const visualizeRhythm = (text) => {
    const words = text.split(/\s+/);
    const newRhythm = words.map((word, index) => ({
      word,
      length: word.length,
      syllables: countSyllables(word),
      isPunchline: word.endsWith('!') || word.endsWith('?') || index === words.length - 1,
      isEmphasis: word.toUpperCase() === word && word.length > 1,
      pause: detectPause(word),
    }));
    setRhythm(newRhythm);
    analyzeJokeStructure(newRhythm);
  };

  const countSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    return word.match(/[aeiouy]{1,2}/g)?.length || 1;
  };

  const detectPause = (word) => {
    if (word.endsWith(',')) return 'short';
    if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) return 'long';
    return 'none';
  };

  const analyzeJokeStructure = (rhythmData) => {
    const totalWords = rhythmData.length;
    const totalSyllables = rhythmData.reduce((sum, item) => sum + item.syllables, 0);
    const punchlineIndex = rhythmData.findIndex(item => item.isPunchline);
    const setupWords = punchlineIndex > -1 ? punchlineIndex : totalWords;
    const punchlineWords = totalWords - setupWords;

    setAnalysis({
      totalWords,
      totalSyllables,
      averageSyllablesPerWord: (totalSyllables / totalWords).toFixed(2),
      setupWords,
      punchlineWords,
      setupToPayoffRatio: (setupWords / punchlineWords).toFixed(2),
      emphasisWords: rhythmData.filter(item => item.isEmphasis).length,
      pauseCount: rhythmData.filter(item => item.pause !== 'none').length,
    });
  };

  const playRhythm = () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const stopRhythm = () => {
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentWordIndex < rhythm.length) {
      timer = setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
        if (rhythmDisplayRef.current) {
          const barToScrollTo = rhythmDisplayRef.current.children[currentWordIndex];
          barToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, (300 / playbackSpeed) * (rhythm[currentWordIndex]?.syllables || 1));
    } else if (currentWordIndex >= rhythm.length) {
      stopRhythm();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentWordIndex, rhythm, playbackSpeed]);

  return (
    <div className="joke-rhythm-visualizer">
      <h2>Joke Rhythm Visualizer</h2>
      <div className="controls">
        <button onClick={playRhythm} disabled={isPlaying}>Play Rhythm</button>
        <button onClick={stopRhythm} disabled={!isPlaying}>Stop</button>
        <label>
          Playback Speed:
          <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))}>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </label>
      </div>
      <div className="rhythm-display" ref={rhythmDisplayRef}>
        {rhythm.map((item, index) => (
          <div
            key={index}
            className={`rhythm-bar ${item.isPunchline ? 'punchline' : ''} ${item.isEmphasis ? 'emphasis' : ''} ${item.pause} ${currentWordIndex === index ? 'active' : ''}`}
            style={{ 
              height: `${item.syllables * 20}px`,
              width: `${Math.max(20, item.length * 5)}px`
            }}
          >
            <span className="word-text">{item.word}</span>
          </div>
        ))}
      </div>
      <div className="joke-analysis">
        <h3>Joke Structure Analysis</h3>
        <ul>
          <li>Total Words: {analysis.totalWords}</li>
          <li>Total Syllables: {analysis.totalSyllables}</li>
          <li>Average Syllables per Word: {analysis.averageSyllablesPerWord}</li>
          <li>Setup Words: {analysis.setupWords}</li>
          <li>Punchline Words: {analysis.punchlineWords}</li>
          <li>Setup to Payoff Ratio: {analysis.setupToPayoffRatio}</li>
          <li>Emphasis Words: {analysis.emphasisWords}</li>
          <li>Pause Count: {analysis.pauseCount}</li>
        </ul>
      </div>
      <audio ref={audioRef} src="/metronome-sound.mp3" loop />
    </div>
  );
}

export default JokeRhythmVisualizer;