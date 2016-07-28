'use strict';

document.body.style.backgroundColor = "red";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    injectLivereload();
});

function injectLivereload() {
    var script = document.createElement("script");
    script.setAttribute("src",
        "https://raw.githubusercontent.com/livereload/livereload-js/master/dist/livereload.js");
    document.head.appendChild(script);
}
