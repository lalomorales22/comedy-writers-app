import React, { useState, useRef, useEffect } from 'react';

const ambienceSounds = [
  { name: 'Small Club', audio: '/sounds/small-club.mp3', crowdSize: 50 },
  { name: 'Large Theater', audio: '/sounds/large-theater.mp3', crowdSize: 500 },
  { name: 'Outdoor Festival', audio: '/sounds/outdoor-festival.mp3', crowdSize: 2000 },
  { name: 'Comedy Cellar', audio: '/sounds/comedy-cellar.mp3', crowdSize: 100 },
  { name: 'College Auditorium', audio: '/sounds/college-auditorium.mp3', crowdSize: 300 },
  { name: 'Bar Open Mic', audio: '/sounds/bar-open-mic.mp3', crowdSize: 30 },
];

const additionalSounds = [
  { name: 'Laughter', audio: '/sounds/laughter.mp3' },
  { name: 'Applause', audio: '/sounds/applause.mp3' },
  { name: 'Booing', audio: '/sounds/booing.mp3' },
  { name: 'Glass Clinking', audio: '/sounds/glass-clinking.mp3' },
  { name: 'Door Opening', audio: '/sounds/door-opening.mp3' },
];

function ComedyClubAmbienceSimulator() {
  const [currentAmbience, setCurrentAmbience] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [crowdEnergy, setCrowdEnergy] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customCrowdSize, setCustomCrowdSize] = useState(100);
  const [additionalSoundPlaying, setAdditionalSoundPlaying] = useState(null);
  const ambienceAudioRef = useRef(null);
  const additionalAudioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (ambienceAudioRef.current) {
        ambienceAudioRef.current.pause();
      }
      if (additionalAudioRef.current) {
        additionalAudioRef.current.pause();
      }
    };
  }, []);

  const playAmbience = (ambience) => {
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.pause();
    }
    ambienceAudioRef.current = new Audio(ambience.audio);
    ambienceAudioRef.current.loop = true;
    ambienceAudioRef.current.volume = volume;
    ambienceAudioRef.current.play();
    setCurrentAmbience(ambience);
    setIsPlaying(true);
    setCustomCrowdSize(ambience.crowdSize);
  };

  const stopAmbience = () => {
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.pause();
    }
    setCurrentAmbience(null);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.volume = newVolume;
    }
  };

  const handleCrowdEnergyChange = (e) => {
    const newEnergy = parseFloat(e.target.value);
    setCrowdEnergy(newEnergy);
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.playbackRate = 0.8 + (newEnergy * 0.4); // Adjust playback rate between 0.8 and 1.2
    }
  };

  const handleCustomCrowdSizeChange = (e) => {
    setCustomCrowdSize(parseInt(e.target.value));
  };

  const playAdditionalSound = (sound) => {
    if (additionalAudioRef.current) {
      additionalAudioRef.current.pause();
    }
    additionalAudioRef.current = new Audio(sound.audio);
    additionalAudioRef.current.volume = volume * 1.5; // Slightly louder than ambience
    additionalAudioRef.current.play();
    setAdditionalSoundPlaying(sound.name);
    additionalAudioRef.current.onended = () => setAdditionalSoundPlaying(null);
  };

  return (
    <div className="comedy-club-ambience-simulator">
      <h2>Comedy Club Ambience Simulator</h2>
      <div className="ambience-controls">
        <h3>Venue Selection</h3>
        {ambienceSounds.map((ambience, index) => (
          <button 
            key={index} 
            onClick={() => playAmbience(ambience)}
            className={currentAmbience?.name === ambience.name ? 'active' : ''}
          >
            {ambience.name}
          </button>
        ))}
        <button onClick={stopAmbience}>Stop Ambience</button>
      </div>
      <div className="audio-controls">
        <label>
          Volume:
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={volume} 
            onChange={handleVolumeChange}
          />
        </label>
        <label>
          Crowd Energy:
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={crowdEnergy} 
            onChange={handleCrowdEnergyChange}
          />
        </label>
        <label>
          Custom Crowd Size:
          <input 
            type="number" 
            value={customCrowdSize} 
            onChange={handleCustomCrowdSizeChange}
            min="1"
          />
        </label>
      </div>
      <div className="additional-sounds">
        <h3>Additional Sounds</h3>
        {additionalSounds.map((sound, index) => (
          <button 
            key={index} 
            onClick={() => playAdditionalSound(sound)}
            disabled={!isPlaying}
          >
            {sound.name}
          </button>
        ))}
      </div>
      <div className="status">
        {currentAmbience && (
          <p>Current ambience: {currentAmbience.name} (Crowd size: {customCrowdSize})</p>
        )}
        {additionalSoundPlaying && <p>Playing: {additionalSoundPlaying}</p>}
      </div>
    </div>
  );
}

export default ComedyClubAmbienceSimulator;