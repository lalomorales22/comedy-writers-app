import React, { useState, useEffect } from 'react';

const promptCategories = {
  "Superhero": [
    "Write a joke about the most useless superhero power",
    "Create a superhero whose power is [MUNDANE_TASK]. What's their catchphrase?",
    "Imagine a world where everyone has superpowers except one person. What's their daily life like?",
    "Write a classified ad for a superhero looking for a sidekick",
    "Describe the most inconvenient time for a superhero's powers to malfunction"
  ],
  "Supernatural": [
    "Create a punchline for: 'I thought I saw a vampire in my kitchen...'",
    "Write a joke about a werewolf's awkward first date",
    "Imagine ghosts have to get day jobs. What would their résumés look like?",
    "Create a setup for a joke about a zombie's midlife crisis",
    "Write a one-liner about a mummy's beauty routine"
  ],
  "Sci-Fi": [
    "Come up with a funny reason why aliens haven't contacted us yet",
    "Write a joke about the perils of time travel",
    "Create a commercial for a teleportation device with an embarrassing side effect",
    "Imagine AI becomes self-aware but is obsessed with [RANDOM_HOBBY]. What happens next?",
    "Write a joke about the most ridiculous use of a shrink ray"
  ],
  "Everyday Life": [
    "Create a setup for a joke that ends with '...and that's why I'm no longer allowed in the zoo.'",
    "Write a joke about the worst possible time for autocorrect to make a mistake",
    "Come up with a funny excuse for being late that involves [HOUSEHOLD_ITEM] and [WILD_ANIMAL]",
    "Create a punchline for: 'I never thought grocery shopping could be so exciting until...'",
    "Write a joke about the most absurd reason for a traffic jam"
  ],
  "Wordplay": [
    "Create a pun using [PROFESSION] and [FRUIT]",
    "Write a joke that uses the same word three times but with different meanings",
    "Come up with a funny portmanteau (blend of two words) and its definition",
    "Create a setup for a joke where the punchline is a popular idiom taken literally",
    "Write a joke that hinges on a mispronunciation of [COMPLICATED_WORD]"
  ]
};

const mundaneTasks = ["folding laundry", "parallel parking", "assembling IKEA furniture", "untangling earbuds", "opening tight jars"];
const randomHobbies = ["knitting", "extreme ironing", "competitive dog grooming", "underwater basket weaving", "professional pillow fighting"];
const householdItems = ["toaster", "blender", "vacuum cleaner", "rubber duck", "throw pillow"];
const wildAnimals = ["giraffe", "penguin", "kangaroo", "sloth", "platypus"];
const professions = ["astronaut", "librarian", "rodeo clown", "subway conductor", "professional dog food taster"];
const fruits = ["durian", "dragonfruit", "kiwi", "kumquat", "lychee"];
const complicatedWords = ["onomatopoeia", "serendipity", "supercalifragilisticexpialidocious", "pneumonoultramicroscopicsilicovolcanoconiosis", "hippopotomonstrosesquippedaliophobia"];

function ComedyWritingPrompts() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      setPromptHistory(JSON.parse(savedHistory));
    }
    getRandomPrompt();
  }, []);

  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
  }, [promptHistory]);

  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  const getRandomPrompt = () => {
    const category = selectedCategory || getRandomElement(Object.keys(promptCategories));
    let prompt = getRandomElement(promptCategories[category]);

    // Replace placeholders with random elements
    prompt = prompt.replace('[MUNDANE_TASK]', getRandomElement(mundaneTasks))
                   .replace('[RANDOM_HOBBY]', getRandomElement(randomHobbies))
                   .replace('[HOUSEHOLD_ITEM]', getRandomElement(householdItems))
                   .replace('[WILD_ANIMAL]', getRandomElement(wildAnimals))
                   .replace('[PROFESSION]', getRandomElement(professions))
                   .replace('[FRUIT]', getRandomElement(fruits))
                   .replace('[COMPLICATED_WORD]', getRandomElement(complicatedWords));

    setCurrentPrompt(prompt);
    setPromptHistory(prevHistory => [prompt, ...prevHistory.slice(0, 9)]);
  };

  const addCustomPrompt = () => {
    if (customPrompt.trim()) {
      const category = selectedCategory || 'Custom';
      if (!promptCategories[category]) {
        promptCategories[category] = [];
      }
      promptCategories[category].push(customPrompt);
      setCustomPrompt('');
      alert('Custom prompt added successfully!');
    }
  };

  return (
    <div className="comedy-writing-prompts">
      <h2>Comedy Writing Prompts</h2>
      <div className="prompt-controls">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Random Category</option>
          {Object.keys(promptCategories).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button onClick={getRandomPrompt}>Get New Prompt</button>
      </div>
      <div className="current-prompt">
        <h3>Current Prompt:</h3>
        <p>{currentPrompt}</p>
      </div>
      <div className="prompt-history">
        <h3>Prompt History:</h3>
        <ul>
          {promptHistory.map((prompt, index) => (
            <li key={index}>{prompt}</li>
          ))}
        </ul>
      </div>
      <div className="custom-prompt">
        <h3>Add Custom Prompt:</h3>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter your custom prompt"
        />
        <button onClick={addCustomPrompt}>Add Prompt</button>
      </div>
    </div>
  );
}

export default ComedyWritingPrompts;