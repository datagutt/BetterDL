// Twitch + bttv + ffz emotes
import emotes from '../emotes.js';
console.log('emotes', emotes);

export default class ChatModule {
    start(){
        const messages = document.querySelector('.v-chatroom-message .chatbody');
        let chatMagicDone =
            messages &&
            messages.getAttribute('data-betterdl') === "true";
        // Get current messages
        if(!chatMagicDone){
            console.log('BetterDL: Doing chat magic')
            messages.setAttribute('data-betterdl', true);
            chatMagicDone = true;

            // Observe new chat messages
            let observer = new MutationObserver(this.mutator);

            observer.observe(messages, {
                childList: true,
                attributes: false,
                characterData: false,
                subtree: true
            });

            // Preloaded messages
            Array.from(messages.querySelector('div').children).forEach((node) => {
                if(node && node.className == 'position-relative') {
                    console.log(node.children[0]);
                    if(node.children[0]) this.onChatMessage(node.children[0]);
                }
            });
        }else{
            console.log('BetterDL: Chat magic already done')
        }
    }
    onChatMessage = entry => {
        // Get the actual text of the message
        let textNode = entry.querySelector('.chatrow-inner .linkify');
        // If this is not a text node
        if(!textNode || !textNode.innerText) return;
        // Get each word
        const rawWords = textNode && textNode.innerText.split(' ');
        let parsedText = '';

        // Go through each word
        for(let i = 0, length = rawWords.length; i < length; i++){
            const word = rawWords[i];
            // Look for word in emote array
            const emote = emotes[word];

            if(typeof emote === 'undefined'){
                parsedText += word + ' ';
            }else{
                parsedText += `<img
                    src="${emote.url}"
                    title="${word} from ${emote.provider}"
                    class="emote-img margint-3 clickable"
                />` + ' ';
            }
        }
        if(parsedText) textNode.innerHTML = parsedText;
    }
    mutator = mutations => {
        return mutations.forEach(mutation => {
            const { addedNodes, removedNodes } = mutation;

            // Added nodes
            if(typeof addedNodes !== 'undefined' && addedNodes.length > 0) {
                for(let i = 0, length = addedNodes.length - 1; i <= length; i++) {
                    let node = addedNodes[i];
                    if(node.className == 'position-relative margint-3') {
                        this.onChatMessage(node.children[0]);
                    }
                }
            }
        });
    }
}
