import React, { useState, useEffect, useRef } from 'react';

const laughTracks = [
  { name: 'Quiet Chuckle', audio: '/laughs/quiet-chuckle.mp3', intensity: 1 },
  { name: 'Hearty Laugh', audio: '/laughs/hearty-laugh.mp3', intensity: 2 },
  { name: 'Uproarious Laughter', audio: '/laughs/uproarious-laughter.mp3', intensity: 3 },
  { name: 'Giggle', audio: '/laughs/giggle.mp3', intensity: 1 },
  { name: 'Snort', audio: '/laughs/snort.mp3', intensity: 2 },
  { name: 'Belly Laugh', audio: '/laughs/belly-laugh.mp3', intensity: 3 },
  { name: 'Polite Laugh', audio: '/laughs/polite-laugh.mp3', intensity: 1 },
  { name: 'Guffaw', audio: '/laughs/guffaw.mp3', intensity: 3 },
  { name: 'Chuckle', audio: '/laughs/chuckle.mp3', intensity: 2 },
];

const otherSounds = [
  { name: 'Applause', audio: '/sounds/applause.mp3' },
  { name: 'Boo', audio: '/sounds/boo.mp3' },
  { name: 'Groan', audio: '/sounds/groan.mp3' },
  { name: 'Whistle', audio: '/sounds/whistle.mp3' },
  { name: 'Crickets', audio: '/sounds/crickets.mp3' },
];

const venueTypes = [
  { name: 'Small Club', size: 50, enthusiasm: 0.8 },
  { name: 'Medium Theater', size: 200, enthusiasm: 0.6 },
  { name: 'Large Auditorium', size: 1000, enthusiasm: 0.4 },
  { name: 'Open Mic Night', size: 30, enthusiasm: 0.5 },
  { name: 'Comedy Festival', size: 500, enthusiasm: 0.9 },
];

function CrowdLaughterSimulator() {
  const [currentLaugh, setCurrentLaugh] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(venueTypes[0]);
  const [crowdSize, setCrowdSize] = useState(venueTypes[0].size);
  const [crowdEnthusiasm, setCrowdEnthusiasm] = useState(venueTypes[0].enthusiasm);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoModeInterval, setAutoModeInterval] = useState(5);
  const autoModeTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (autoModeTimeoutRef.current) {
        clearTimeout(autoModeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAutoMode) {
      triggerAutoLaugh();
    } else if (autoModeTimeoutRef.current) {
      clearTimeout(autoModeTimeoutRef.current);
    }
  }, [isAutoMode, autoModeInterval, crowdSize, crowdEnthusiasm]);

  const playAudio = (audioSrc, setterFunction) => {
    if (currentLaugh) {
      currentLaugh.pause();
      currentLaugh.currentTime = 0;
    }
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0;
    }
    const audio = new Audio(audioSrc);
    audio.volume = Math.min(crowdSize / 1000, 1) * crowdEnthusiasm;
    audio.play();
    setterFunction(audio);
  };

  const playLaughter = (laugh) => {
    playAudio(laugh.audio, setCurrentLaugh);
  };

  const playSound = (sound) => {
    playAudio(sound.audio, setCurrentSound);
  };

  const triggerAutoLaugh = () => {
    const randomLaugh = laughTracks[Math.floor(Math.random() * laughTracks.length)];
    playLaughter(randomLaugh);
    const nextInterval = Math.random() * (autoModeInterval * 2) * 1000;
    autoModeTimeoutRef.current = setTimeout(triggerAutoLaugh, nextInterval);
  };

  const handleVenueChange = (e) => {
    const newVenue = venueTypes.find(venue => venue.name === e.target.value);
    setSelectedVenue(newVenue);
    setCrowdSize(newVenue.size);
    setCrowdEnthusiasm(newVenue.enthusiasm);
  };

  const getLaughIntensityClass = (intensity) => {
    switch (intensity) {
      case 1: return 'low-intensity';
      case 2: return 'medium-intensity';
      case 3: return 'high-intensity';
      default: return '';
    }
  };

  return (
    <div className="crowd-laughter-simulator">
      <h2>Crowd Laughter Simulator</h2>
      <div className="venue-controls">
        <select value={selectedVenue.name} onChange={handleVenueChange}>
          {venueTypes.map((venue) => (
            <option key={venue.name} value={venue.name}>{venue.name}</option>
          ))}
        </select>
        <div className="crowd-size-control">
          <label>Crowd Size: </label>
          <input 
            type="range" 
            min="10" 
            max="1000" 
            value={crowdSize} 
            onChange={(e) => setCrowdSize(Number(e.target.value))} 
          />
          <span>{crowdSize}</span>
        </div>
        <div className="crowd-enthusiasm-control">
          <label>Crowd Enthusiasm: </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={crowdEnthusiasm} 
            onChange={(e) => setCrowdEnthusiasm(Number(e.target.value))} 
          />
          <span>{(crowdEnthusiasm * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className="laughter-buttons">
        <h3>Laughter Tracks</h3>
        {laughTracks.map((laugh, index) => (
          <button 
            key={index} 
            onClick={() => playLaughter(laugh)}
            className={getLaughIntensityClass(laugh.intensity)}
          >
            {laugh.name}
          </button>
        ))}
      </div>
      <div className="other-sounds">
        <h3>Other Sounds</h3>
        {otherSounds.map((sound, index) => (
          <button key={index} onClick={() => playSound(sound)}>
            {sound.name}
          </button>
        ))}
      </div>
      <div className="auto-mode-controls">
        <h3>Auto Mode</h3>
        <label>
          <input 
            type="checkbox" 
            checked={isAutoMode} 
            onChange={(e) => setIsAutoMode(e.target.checked)} 
          />
          Enable Auto Mode
        </label>
        <div>
          <label>Interval (seconds): </label>
          <input 
            type="number" 
            value={autoModeInterval} 
            onChange={(e) => setAutoModeInterval(Number(e.target.value))} 
            min="1" 
            max="30" 
          />
        </div>
      </div>
    </div>
  );
}

export default CrowdLaughterSimulator;