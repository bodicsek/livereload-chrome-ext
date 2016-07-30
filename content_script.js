'use strict';

var script;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  switch (msg.msg) {
    case "inject":
      console.log("[LIVERELOAD CONTENT] inject");
      injectLivereload();
      break;
    case "extract":
      console.log("[LIVERELOAD CONTENT] extract");
      extractLivereload();
    default:
      break;
  }
});

function injectLivereload() {
  if (script) {
    extractLivereload();
  }
  script = document.createElement("script");
  script.setAttribute("src", "http://localhost:35729/livereload.js");
  document.head.appendChild(script);
}

function extractLivereload() {
  if (script) {
    script.parentNode.removeChild(script);
    script = null;
  }
}
