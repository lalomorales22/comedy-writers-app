import React, { useState, useEffect } from 'react';
import JokeInput from './components/JokeInput';
import AudioRecorder from './components/AudioRecorder';
import JokeList from './components/JokeList';
import KeywordVisualizer from './components/KeywordVisualizer';
import CrowdLaughterSimulator from './components/CrowdLaughterSimulator';
import ComedyWritingPrompts from './components/ComedyWritingPrompts';
import JokeRhythmVisualizer from './components/JokeRhythmVisualizer';
import JokeFusionGenerator from './components/JokeFusionGenerator';
import ComedyStyleAnalyzer from './components/ComedyStyleAnalyzer';
import VirtualHecklerMode from './components/VirtualHecklerMode';
import ComedicPremiseExplorer from './components/ComedicPremiseExplorer';
import AudienceReactionProbability from './components/AudienceReactionProbability';
import CallbackTracker from './components/CallbackTracker';
import JokeToMemeConverter from './components/JokeToMemeConverter';
import ComedyClubAmbienceSimulator from './components/ComedyClubAmbienceSimulator';
import './App.css';

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    const savedJokes = JSON.parse(localStorage.getItem('jokes') || '[]');
    setJokes(savedJokes);
  }, []);

  useEffect(() => {
    localStorage.setItem('jokes', JSON.stringify(jokes));
  }, [jokes]);

  const addJoke = (joke) => {
    setJokes([...jokes, { ...joke, id: Date.now() }]);
  };

  return (
    <div className="App">
      <h1>Comedy Writer's Toolkit</h1>
      <div className="app-container">
        <div className="input-section">
          <JokeInput addJoke={addJoke} />
          <AudioRecorder addJoke={addJoke} />
        </div>
        <JokeList jokes={jokes} />
        <KeywordVisualizer jokes={jokes} />
        <CrowdLaughterSimulator />
        <ComedyWritingPrompts />
        <JokeRhythmVisualizer jokeText={jokes.length > 0 ? jokes[jokes.length - 1].content : ''} />
        <JokeFusionGenerator />
        <ComedyStyleAnalyzer jokes={jokes} />
        <VirtualHecklerMode />
        <ComedicPremiseExplorer />
        <AudienceReactionProbability />
        <CallbackTracker jokes={jokes} />
        <JokeToMemeConverter />
        <ComedyClubAmbienceSimulator />
      </div>
    </div>
  );
}

export default App;