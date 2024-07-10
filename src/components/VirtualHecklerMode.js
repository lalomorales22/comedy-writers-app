import React, { useState, useEffect } from 'react';

const heckleCategories = {
  general: [
    "You're about as funny as a funeral!",
    "I've seen better comedy in a traffic jam!",
    "Is this your act or your cry for help?",
    "Do you take requests? How about you request a refund for those comedy classes!",
    "I've heard better jokes from my GPS!"
  ],
  appearance: [
    "Hey, did you get dressed in the dark?",
    "I didn't know it was Halloween already!",
    "Is that your face or did your neck throw up?",
    "You look like you fell out of the ugly tree and hit every branch on the way down!",
    "I've seen better looking faces on inanimate objects!"
  ],
  performance: [
    "Are you going to tell a joke sometime tonight?",
    "I've had more fun watching paint dry!",
    "Is this a comedy show or a hostage situation?",
    "Your act is so bad, it should come with a warning label!",
    "I've seen better performances from a malfunctioning robot!"
  ],
  intelligent: [
    "Your comedy is so superficial, it makes reality TV look profound!",
    "I've heard more insightful comments from a fortune cookie!",
    "Your jokes are like quantum mechanics - nobody gets them!",
    "Is this supposed to be avant-garde or just incompetent?",
    "I've seen deeper puddles than your comedic repertoire!"
  ]
};

const difficultyLevels = {
  easy: 0.7,
  medium: 0.85,
  hard: 1
};

function VirtualHecklerMode() {
  const [currentHeckle, setCurrentHeckle] = useState('');
  const [heckleHistory, setHeckleHistory] = useState([]);
  const [comebackTime, setComebackTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [selectedCategories, setSelectedCategories] = useState(['general']);
  const [customHeckle, setCustomHeckle] = useState('');

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setComebackTime(prevTime => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const generateHeckle = () => {
    const availableHeckles = selectedCategories.flatMap(category => heckleCategories[category]);
    const randomIndex = Math.floor(Math.random() * availableHeckles.length);
    const newHeckle = availableHeckles[randomIndex];
    setCurrentHeckle(newHeckle);
    setHeckleHistory(prevHistory => [...prevHistory, newHeckle]);
    setComebackTime(0);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const addCustomHeckle = () => {
    if (customHeckle.trim()) {
      heckleCategories.general.push(customHeckle);
      setCustomHeckle('');
      alert('Custom heckle added successfully!');
    }
  };

  const getScoreMessage = () => {
    const timeLimit = 5 * difficultyLevels[difficultyLevel];
    if (comebackTime <= timeLimit) {
      return "Great job! Quick comeback!";
    } else if (comebackTime <= timeLimit * 1.5) {
      return "Not bad, but try to be quicker next time.";
    } else {
      return "Too slow! The audience is getting restless.";
    }
  };

  return (
    <div className="virtual-heckler-mode">
      <h2>Virtual Heckler Mode</h2>
      <div className="controls">
        <select 
          value={difficultyLevel} 
          onChange={(e) => setDifficultyLevel(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div className="category-selection">
          {Object.keys(heckleCategories).map(category => (
            <label key={category}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => {
                  setSelectedCategories(prev => 
                    prev.includes(category)
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  );
                }}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
      <button onClick={generateHeckle}>Generate Heckle</button>
      {currentHeckle && (
        <div className="heckle-display">
          <p><strong>Heckler says:</strong> {currentHeckle}</p>
          <p>Quick! Come up with a comeback!</p>
          <p>Time: {comebackTime.toFixed(1)} seconds</p>
          <button onClick={stopTimer}>I've got a comeback!</button>
          {!isTimerRunning && <p>{getScoreMessage()}</p>}
        </div>
      )}
      <div className="custom-heckle">
        <input
          type="text"
          value={customHeckle}
          onChange={(e) => setCustomHeckle(e.target.value)}
          placeholder="Enter your own heckle"
        />
        <button onClick={addCustomHeckle}>Add Custom Heckle</button>
      </div>
      <div className="heckle-history">
        <h3>Heckle History</h3>
        <ul>
          {heckleHistory.map((heckle, index) => (
            <li key={index}>{heckle}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VirtualHecklerMode;