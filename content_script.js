"use strict";
var chrome;

var script;

chrome.runtime.onMessage.addListener(function (msg) {
  switch (msg.msg) {
    case "inject":
      console.log("[LIVERELOAD CONTENT] inject " + msg.url);
      injectLivereload(msg.url);
      break;
    case "extract":
      console.log("[LIVERELOAD CONTENT] extract");
      extractLivereload();
      break;
    default:
      break;
  }
});

function injectLivereload(url) {
  if (script) {
    extractLivereload();
  }
  script = document.createElement("script");
  script.setAttribute("src", url);
  document.head.appendChild(script);
}

function extractLivereload() {
  if (script) {
    script.parentNode.removeChild(script);
    script = null;
  }
}
