// inject the hook
const script = document.createElement('script')
script.setAttribute('src', chrome.runtime.getURL('inject.js'));
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)