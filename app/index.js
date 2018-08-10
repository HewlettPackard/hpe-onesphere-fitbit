import document from "document";
import * as messaging from "messaging";

const background = document.getElementById("background");
const bigLogo = document.getElementById("bigLogo");
const content = document.getElementById("contentInstance");
const mixedText = document.getElementById("mixedText");
const textMain = mixedText.getElementById("header");
const textSub = mixedText.getElementById("copy");
const stage = document.getElementById("stats-cycle");

const mixedText2 = document.getElementById("mixedText2");
const textMain2 = mixedText2.getElementById("header");
const textSub2 = mixedText2.getElementById("copy");

const textBtm = document.getElementById("textBtm");

const mixedTextError = document.getElementById("mixedTextError");
const textMainError = mixedTextError.getElementById("header");
const textSubError = mixedTextError.getElementById("copy");

let currPage = 1;
let totals;
let looped = false;

stage.onclick = () => {
  if (currPage === 0 && looped) {
    textSub.text = totals[currPage].title;
    textMain.text = `$${totals[currPage].cost}`;
  } else if (currPage % 2 === 1) {
    textSub2.text = totals[currPage].title;
    textMain2.text = `$${totals[currPage].cost}`;
  } else {
    textSub.text = totals[currPage].title;
    textMain.text = `$${totals[currPage].cost}`;
  }
  
  if (currPage !== totals.length - 1) {
    currPage++;
  } else {
    looped = true;
    currPage = 0;
  }
}

const handleError = (errorString, title) => {
  bigLogo.style.display = 'none';
  textBtm.style.display = 'none';
  textMainError.text = title || 'Error';
  textSubError.text = errorString.toString();
  content.style.opacity = 0;
}

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "totals" && evt.data.totals) {
    // Reset error
    textMainError.text = '';
    textSubError.text = '';
    content.style.opacity = 1;
    totals = evt.data.totals;
    bigLogo.style.opacity = 0;
    textBtm.style.opacity = 0;
    textSub.text = totals[0].title;
    textMain.text = `$${totals[0].cost}`;
    content.animate("enable");
    
    if (totals.length > 1) { 
      textSub2.text = totals[1].title;
      textMain2.text = `$${totals[1].cost}`;
    }
  }
  if (evt.data.key === "error" && evt.data.error) {
    handleError(evt.data.error.toString(), evt.data.title);
  }
  if (evt.data.errorCode) {
    handleError('Invalid credentials supplied.');
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
  console.log(JSON.stringify(content, null, 2));
  content.onclick = () => {console.log('test')};
}; 

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};
