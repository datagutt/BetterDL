// Create the injection script element
const script = document.createElement('script');
script.setAttribute('src', chrome.runtime.getURL('inject.js'));
script.defer = 'defer';
script.async = 'async';
// We want to be able to use static imports, so set module as type
script.type = 'module';

// The idea of this is to run the script after app.js is loaded, but before the page-specific scripts are loaded
let appScript = document.body.querySelector('script[src^="/js/app"]');
if(appScript){
    appScript.parentNode.insertBefore(script, appScript.nextSibling);
}else{
    document.head.appendChild(script);
}