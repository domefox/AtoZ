// A2Z F24
// Daniel Shiffman
// https://github.com/Programming-from-A-to-Z/A2Z-F24
// Many DOM elements
let dropZone, input, button, sample, clearButton;
// An array to keep track of all the new DOM elements being added
let paragraphs = [];

function setup() {
  noCanvas();
  // Selecting the text field and button
  input = select('#textinput');
  button = select('#submit');
  // What to do when button pressed
  button.mousePressed(handleInput);
  // Selected the div which will be the "drop zone"
  // for dragging and dropping files
  dropZone = select('#drop_zone');
  // Here are the events to handle
  dropZone.dragOver(highlight);
  dropZone.drop(gotFile, unHighlight);
  // This link allows quick testing with a file
  // that's ready to load instantly
  sample = select('#sample');
  sample.mousePressed(loadFile);
  // This button clears the new paragraph elements
  // added
  clearButton = select('#clearButton');
  clearButton.mousePressed(clearText);
}

// Load a file for quick testing
function loadFile() {
  loadStrings('license.txt', fileLoaded);
}

// When the file is loaded
function fileLoaded(data) {
  let txt = data.join('\n');
  input.html(txt);
}

// Handle dropzone events
function highlight() {
  dropZone.style('background', '#AAA');
}

function unHighlight() {
  dropZone.style('background', '');
}

function gotFile(file) {
  if (file.type === 'text') {
    input.html(file.data);
  } else {
    // In case it's some weird other kind of file
    alert('this is not a text file.');
  }
}

// Handle the text input field
function handleInput() {
  process(input.value());
}

// Clear all the divs with remove()
function clearText() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].remove();
  }
  paragraphs = [];
}

// CHANGED: Completely rewrote this function using regex-based methods
function process(data) {
  // Check to see if they entered something
  if (data.length === 0) {
    alert("Enter something!");
  } else {
    // CHANGED: Use regex to count words more accurately
    const words = data.match(/\b\w+\b/g) || [];
    const totalWords = words.length;

    // CHANGED: Use regex to count sentences more accurately
    const totalSentences = (data.match(/[.!?]+/g) || []).length;

    // CHANGED: Calculate total syllables using the new countSyllables function
    const totalSyllables = words.reduce((count, word) => count + countSyllables(word), 0);

    // Calculate flesch index
    const f1 = 206.835;
    const f2 = 84.6;
    const f3 = 1.015;
    const r1 = totalSyllables / totalWords;
    const r2 = totalWords / totalSentences;
    const flesch = f1 - (f2 * r1) - (f3 * r2);

    // Write Report
    const report = `
      Total Syllables: ${totalSyllables}<br/>
      Total Words    : ${totalWords}<br/>
      Total Sentences: ${totalSentences}<br/>
      Flesch Index   : ${flesch.toFixed(2)}
    `;

    const fleschP = createP(report);
    fleschP.class('text');
    paragraphs.push(fleschP);
  }
}

// CHANGED: Completely rewrote this function using regex
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  return (word.match(/[aeiouy]{1,2}/g) || []).length;
}

// CHANGED: Removed isVowel function as it's no longer needed