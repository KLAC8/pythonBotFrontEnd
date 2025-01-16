function addMessage(message, isUser) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const message = inputElement.value.trim();

    if (message) {
        addMessage(message, true);
        inputElement.value = '';
        inputElement.disabled = true;

        try {
            // Update the URL to point to your Netlify backend (adjust <your-netlify-site>)
            const response = await fetch('https://pythonbot.netlify.app/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            if (data.error) {
                addMessage('Error: ' + data.error, false);
            } else {
                addMessage(data.response, false);
            }
        } catch (error) {
            addMessage('Error: Could not connect to the server', false);
        }

        inputElement.disabled = false;
        inputElement.focus();
    }
}

// Allow Enter key to send messages
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
