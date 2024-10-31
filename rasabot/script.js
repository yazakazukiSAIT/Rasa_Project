// Select elements from the DOM
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Event listeners for sending message with button click or pressing Enter key
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

// Function to render Markdown links as HTML
function renderMarkdown(text) {
    return text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
               .replace(/\n/g, '<br>'); // Handles new line breaks
}

// Function to send the message to the Rasa bot
function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessageToChat('User', message);

        // Send message to Rasa server via the ngrok URL
        fetch("https://5866-205-206-111-153.ngrok-free.app/webhooks/rest/webhook", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://renounding.github.io',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ sender: 'user', message: message })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                data.forEach(response => {
                    addMessageToChat('Goodie-Bot', response.text);
                });
            } else {
                addMessageToChat('Goodie-Bot', "I apologize, I didn't understand that. Could you please rephrase?");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessageToChat('Goodie-Bot', 'Error connecting to the server. Please try again later.');
        });

        userInput.value = ''; // Clear the input field
    }
}

// Function to add messages to the chat window
function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender.toLowerCase().replace(' ', '-'));
    messageElement.innerHTML = `<strong>${sender}:</strong> ${renderMarkdown(message)}`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
}

// Optional: Add a greeting message when the chat loads
window.addEventListener('load', () => {
    addMessageToChat('Goodie-Bot', 'Hello! Welcome to Goodie Bot Demo. How can I assist you today?');
});
