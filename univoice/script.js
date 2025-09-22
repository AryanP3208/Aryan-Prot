// UniVoice Interactive Demo Script

class UniVoiceDemo {
    constructor() {
        this.isRecording = false;
        this.isTranslating = false;
        this.recordedText = '';
        this.translatedText = '';
        
        this.initializeElements();
        this.bindEvents();
        this.setupSpeechRecognition();
    }

    initializeElements() {
        this.recordBtn = document.getElementById('recordBtn');
        this.translateBtn = document.getElementById('translateBtn');
        this.playBtn = document.getElementById('playBtn');
        this.waveAnimation = document.getElementById('waveAnimation');
        this.originalText = document.getElementById('originalText');
        this.translatedTextElement = document.getElementById('translatedText');
        this.startDemoBtn = document.getElementById('startDemo');
    }

    bindEvents() {
        this.recordBtn.addEventListener('click', () => this.toggleRecording());
        this.translateBtn.addEventListener('click', () => this.translateText());
        this.playBtn.addEventListener('click', () => this.playTranslation());
        this.startDemoBtn.addEventListener('click', () => this.scrollToDemo());
    }

    setupSpeechRecognition() {
        // Check if speech recognition is supported
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.waveAnimation.style.opacity = '0.7';
                this.waveAnimation.style.animationPlayState = 'running';
            };

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    this.recordedText = finalTranscript;
                    this.originalText.textContent = this.recordedText;
                    this.translateBtn.disabled = false;
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopRecording();
            };

            this.recognition.onend = () => {
                this.stopRecording();
            };
        } else {
            // Fallback for browsers that don't support speech recognition
            this.recognition = null;
            console.warn('Speech recognition not supported in this browser');
        }
    }

    scrollToDemo() {
        document.getElementById('demo').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        if (this.recognition) {
            this.isRecording = true;
            this.recordBtn.textContent = '⏹️ Stop Recording';
            this.recordBtn.style.background = '#ff2b75';
            this.originalText.textContent = 'Listening...';
            this.translatedTextElement.textContent = 'Translation will appear here...';
            this.translateBtn.disabled = true;
            this.playBtn.disabled = true;
            
            this.recognition.start();
        } else {
            // Fallback demo text for browsers without speech recognition
            this.simulateRecording();
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
        
        this.isRecording = false;
        this.recordBtn.textContent = '🎤 Start Recording';
        this.recordBtn.style.background = '';
        this.waveAnimation.style.opacity = '0';
        this.waveAnimation.style.animationPlayState = 'paused';
    }

    simulateRecording() {
        // Simulate recording for demo purposes
        this.isRecording = true;
        this.recordBtn.textContent = '⏹️ Stop Recording';
        this.recordBtn.style.background = '#ff2b75';
        this.originalText.textContent = 'Simulating speech recognition...';
        this.waveAnimation.style.opacity = '0.7';
        
        setTimeout(() => {
            this.recordedText = 'Hello, welcome to UniVoice! This is a demonstration of our voice recognition system.';
            this.originalText.textContent = this.recordedText;
            this.translateBtn.disabled = false;
            this.stopRecording();
        }, 3000);
    }

    async translateText() {
        if (!this.recordedText) return;
        
        this.isTranslating = true;
        this.translateBtn.textContent = '⏳ Translating...';
        this.translateBtn.disabled = true;
        this.translatedTextElement.textContent = 'Processing translation...';
        
        // Simulate translation API call
        await this.simulateTranslation();
        
        this.isTranslating = false;
        this.translateBtn.textContent = '🌐 Translate';
        this.translateBtn.disabled = false;
        this.playBtn.disabled = false;
    }

    async simulateTranslation() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Demo translations based on common phrases
        const translations = {
            'hello': 'Hola (Spanish) / Bonjour (French) / こんにちは (Japanese)',
            'welcome': 'Bienvenido (Spanish) / Bienvenue (French) / いらっしゃいませ (Japanese)',
            'thank you': 'Gracias (Spanish) / Merci (French) / ありがとう (Japanese)',
            'goodbye': 'Adiós (Spanish) / Au revoir (French) / さようなら (Japanese)'
        };
        
        let translation = 'Hola, ¡bienvenido a UniVoice! Esta es una demostración de nuestro sistema de reconocimiento de voz. (Spanish Translation)';
        
        // Check if recorded text contains common phrases
        const lowerText = this.recordedText.toLowerCase();
        for (const [key, value] of Object.entries(translations)) {
            if (lowerText.includes(key)) {
                translation = value;
                break;
            }
        }
        
        this.translatedText = translation;
        this.translatedTextElement.textContent = this.translatedText;
    }

    playTranslation() {
        if (!this.translatedText) return;
        
        this.playBtn.textContent = '🔊 Playing...';
        this.playBtn.disabled = true;
        
        // Use Speech Synthesis API if available
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.translatedText);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            utterance.onend = () => {
                this.playBtn.textContent = '🔊 Play';
                this.playBtn.disabled = false;
            };
            
            speechSynthesis.speak(utterance);
        } else {
            // Fallback for browsers without speech synthesis
            setTimeout(() => {
                this.playBtn.textContent = '🔊 Play';
                this.playBtn.disabled = false;
                alert('Speech synthesis not supported in this browser');
            }, 2000);
        }
    }
}

// Initialize the demo when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UniVoiceDemo();
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add interactive hover effects for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add typing animation for hero text
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 30);
    }
});