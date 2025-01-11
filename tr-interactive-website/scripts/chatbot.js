class Chatbot {
    constructor() {
        this.messages = [];
        this.container = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendButton = document.getElementById('chatbot-send');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.processUserMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processUserMessage();
        });
    }
    
    processUserMessage() {
        const userMessage = this.input.value.trim();
        if (userMessage === '') return;
        
        this.addMessage('user', userMessage);
        this.input.value = '';
        
        // Simulation de réponse IA
        const botResponse = this.generateResponse(userMessage);
        setTimeout(() => this.addMessage('bot', botResponse), 500);
    }
    
    addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        
        this.container.appendChild(messageElement);
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        const responses = {
            'bonjour': 'Bonjour ! Comment puis-je vous aider ?',
            'prix': 'Nos prix varient selon les produits. Voulez-vous plus de détails ?',
            'livraison': 'Nous livrons dans toute la France métropolitaine.',
            'default': 'Je suis un assistant virtuel. Posez-moi une question sur nos produits.'
        };
        
        for (let [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        return responses['default'];
    }
}

function setupChatbot() {
    new Chatbot();
}
