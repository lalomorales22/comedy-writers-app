import React, { useState, useEffect } from 'react';

const premiseTemplates = [
  "What if [TOPIC] was actually a secret plot by [RANDOM_GROUP]?",
  "Imagine [TOPIC] but in a world where [BIZARRE_SCENARIO]",
  "How would [FAMOUS_PERSON] deal with [TOPIC]?",
  "[TOPIC]: The untold story of its rivalry with [UNRELATED_THING]",
  "The real reason [TOPIC] exists is because [ABSURD_REASON]",
  "In an alternate universe, [TOPIC] is responsible for [HISTORICAL_EVENT]",
  "What if [TOPIC] and [ANOTHER_TOPIC] switched places for a day?",
  "[TOPIC]: The next big trend in [INDUSTRY]",
  "The secret connection between [TOPIC] and [CONSPIRACY_THEORY]",
  "[TOPIC]: The untold origin story of [FICTIONAL_CHARACTER]",
  "What if [TOPIC] was invented by [UNLIKELY_INVENTOR]?",
  "[TOPIC]: The unexpected solution to [GLOBAL_PROBLEM]",
  "The hidden influence of [TOPIC] on [ART_MOVEMENT]",
  "[TOPIC]: The true inspiration behind [FAMOUS_QUOTE]",
  "What if [TOPIC] was actually a metaphor for [PHILOSOPHICAL_CONCEPT]?",
];

const randomGroups = ["aliens", "time travelers", "sentient AI", "talking animals", "mimes", "secret society of librarians", "underground network of baristas", "coalition of disgruntled crossing guards", "league of extraordinary janitors", "illuminati of ice cream truck drivers"];
const bizarreScenarios = ["gravity is reversed", "everyone can read minds", "sleep is illegal", "money doesn't exist", "all food tastes like chicken", "laughter is contagious like a virus", "everyone has a personal soundtrack", "clouds are solid and walkable", "plants can talk but only complain", "time runs backwards on weekends"];
const famousPeople = ["Shakespeare", "Abraham Lincoln", "Beyoncé", "Elon Musk", "Your grandma", "Genghis Khan", "Lady Gaga", "Socrates", "Gordon Ramsay", "Marie Curie", "Leonardo da Vinci", "Queen Elizabeth I", "Steve Irwin", "Cleopatra", "A sentient AI version of Bob Ross"];
const unrelatedThings = ["toasters", "sock puppets", "elevator music", "traffic cones", "quantum physics", "garden gnomes", "disco balls", "submarine sandwiches", "novelty keychains", "self-help books", "conspiracy theories", "interpretive dance", "fortune cookies", "knock-knock jokes", "abstract expressionism"];
const absurdReasons = ["it's actually cake", "it's a glitch in the Matrix", "it's all a dream", "cats demanded it", "to confuse future archaeologists", "aliens lost a bet", "a time traveler sneezed", "it's an elaborate practical joke", "the universe has a sense of humor", "it's a social experiment gone too far"];
const historicalEvents = ["the French Revolution", "the Moon landing", "the invention of the internet", "the fall of the Roman Empire", "the Renaissance", "the Industrial Revolution", "the discovery of America", "the writing of the Declaration of Independence", "the building of the Great Wall of China", "the signing of the Magna Carta"];
const industries = ["fashion", "tech startups", "fast food", "space exploration", "pet accessories", "extreme sports", "self-help seminars", "artisanal cheese making", "virtual reality", "underwater basket weaving"];
const conspiracyTheories = ["flat Earth", "faked Moon landing", "lizard people", "Illuminati", "Bigfoot", "crop circles", "Area 51", "the Loch Ness Monster", "chemtrails", "the Bermuda Triangle"];
const fictionalCharacters = ["Batman", "Harry Potter", "Sherlock Holmes", "Darth Vader", "Wonder Woman", "James Bond", "Gandalf", "Katniss Everdeen", "Captain Jack Sparrow", "The Joker"];
const unlikelyInventors = ["a group of kindergarteners", "a colony of ants", "a bored houseplant", "a team of interpretive dancers", "a committee of conspiracy theorists", "a gathering of mimes", "a flock of confused penguins", "a council of fortune cookie writers", "a band of time-traveling cavemen", "a union of disgruntled GPS voices"];
const globalProblems = ["climate change", "world hunger", "economic inequality", "education reform", "healthcare access", "overpopulation", "energy crisis", "water scarcity", "deforestation", "political polarization"];
const artMovements = ["Surrealism", "Cubism", "Impressionism", "Pop Art", "Abstract Expressionism", "Dadaism", "Minimalism", "Baroque", "Art Nouveau", "Futurism"];
const famousQuotes = ["To be or not to be", "I have a dream", "One small step for man", "Let them eat cake", "I think, therefore I am", "Be the change you wish to see in the world", "Ask not what your country can do for you", "That's one small step for man, one giant leap for mankind", "I have not failed. I've just found 10,000 ways that won't work", "The only thing we have to fear is fear itself"];
const philosophicalConcepts = ["existentialism", "nihilism", "utilitarianism", "solipsism", "determinism", "moral relativism", "dualism", "empiricism", "stoicism", "hedonism"];

function ComedicPremiseExplorer() {
  const [topic, setTopic] = useState('');
  const [secondaryTopic, setSecondaryTopic] = useState('');
  const [premise, setPremise] = useState('');
  const [generatedPremises, setGeneratedPremises] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customElements, setCustomElements] = useState({});
  const [complexityLevel, setComplexityLevel] = useState(1);

  useEffect(() => {
    const savedPremises = localStorage.getItem('generatedPremises');
    if (savedPremises) {
      setGeneratedPremises(JSON.parse(savedPremises));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('generatedPremises', JSON.stringify(generatedPremises));
  }, [generatedPremises]);

  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  const generatePremise = () => {
    if (!topic) return;

    const template = selectedTemplate || getRandomElement(premiseTemplates);
    let newPremise = template
      .replace(/\[TOPIC\]/g, topic)
      .replace(/\[ANOTHER_TOPIC\]/g, secondaryTopic || topic)
      .replace(/\[RANDOM_GROUP\]/g, customElements.RANDOM_GROUP || getRandomElement(randomGroups))
      .replace(/\[BIZARRE_SCENARIO\]/g, customElements.BIZARRE_SCENARIO || getRandomElement(bizarreScenarios))
      .replace(/\[FAMOUS_PERSON\]/g, customElements.FAMOUS_PERSON || getRandomElement(famousPeople))
      .replace(/\[UNRELATED_THING\]/g, customElements.UNRELATED_THING || getRandomElement(unrelatedThings))
      .replace(/\[ABSURD_REASON\]/g, customElements.ABSURD_REASON || getRandomElement(absurdReasons))
      .replace(/\[HISTORICAL_EVENT\]/g, customElements.HISTORICAL_EVENT || getRandomElement(historicalEvents))
      .replace(/\[INDUSTRY\]/g, customElements.INDUSTRY || getRandomElement(industries))
      .replace(/\[CONSPIRACY_THEORY\]/g, customElements.CONSPIRACY_THEORY || getRandomElement(conspiracyTheories))
      .replace(/\[FICTIONAL_CHARACTER\]/g, customElements.FICTIONAL_CHARACTER || getRandomElement(fictionalCharacters))
      .replace(/\[UNLIKELY_INVENTOR\]/g, customElements.UNLIKELY_INVENTOR || getRandomElement(unlikelyInventors))
      .replace(/\[GLOBAL_PROBLEM\]/g, customElements.GLOBAL_PROBLEM || getRandomElement(globalProblems))
      .replace(/\[ART_MOVEMENT\]/g, customElements.ART_MOVEMENT || getRandomElement(artMovements))
      .replace(/\[FAMOUS_QUOTE\]/g, customElements.FAMOUS_QUOTE || getRandomElement(famousQuotes))
      .replace(/\[PHILOSOPHICAL_CONCEPT\]/g, customElements.PHILOSOPHICAL_CONCEPT || getRandomElement(philosophicalConcepts));

    if (complexityLevel > 1) {
      newPremise += ` And what if it turns out that ${getRandomElement(famousPeople)} was behind it all along?`;
    }
    if (complexityLevel > 2) {
      newPremise += ` But plot twist: it's all happening inside a ${getRandomElement(unrelatedThings)}.`;
    }

    setPremise(newPremise);
    setGeneratedPremises(prev => [newPremise, ...prev.slice(0, 9)]);
  };

  const handleCustomElementChange = (key, value) => {
    setCustomElements(prev => ({...prev, [key]: value}));
  };

  return (
    <div className="comedic-premise-explorer">
      <h2>Comedic Premise Explorer</h2>
      <div className="input-section">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter primary topic"
        />
        <input
          type="text"
          value={secondaryTopic}
          onChange={(e) => setSecondaryTopic(e.target.value)}
          placeholder="Enter secondary topic (optional)"
        />
        <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="">Random Template</option>
          {premiseTemplates.map((template, index) => (
            <option key={index} value={template}>{template}</option>
          ))}
        </select>
        <div className="complexity-control">
          <label>Complexity Level:</label>
          <input
            type="range"
            min="1"
            max="3"
            value={complexityLevel}
            onChange={(e) => setComplexityLevel(parseInt(e.target.value))}
          />
          <span>Level: {complexityLevel}</span>
        </div>
      </div>
      <div className="custom-elements">
        <h3>Custom Elements (Optional)</h3>
        {Object.keys(premiseTemplates[0].match(/\[([^\]]+)\]/g).map(m => m.slice(1, -1))).map(key => (
          <input
            key={key}
            type="text"
            value={customElements[key] || ''}
            onChange={(e) => handleCustomElementChange(key, e.target.value)}
            placeholder={`Custom ${key.toLowerCase().replace(/_/g, ' ')}`}
          />
        ))}
      </div>
      <button onClick={generatePremise}>Generate Premise</button>
      {premise && (
        <div className="premise-display">
          <h3>Latest Comedic Premise:</h3>
          <p>{premise}</p>
        </div>
      )}
      <div className="premise-history">
        <h3>Generated Premises History:</h3>
        <ul>
          {generatedPremises.map((p, index) => (
            <li key={index}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ComedicPremiseExplorer;