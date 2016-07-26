'use strict';

document.body.style.backgroundColor = "red";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    injectLivereload();
});

function injectLivereload() {
    var script = document.createElement("script");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/livereload/livereload-js/master/dist/livereload.js", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            script.text = xhr.responseText;
            document.body.appendChild(script);
        }
    }
    xhr.send();
}
