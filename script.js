// AI Class
class HariAI {
    constructor() {
        this.conversationCount = 0;
    }

    getResponse(userInput) {
        this.conversationCount++;
        const cleanInput = userInput.toLowerCase().trim();

        if (this.conversationCount === 1) {
            return "Hello! I'm Hari AI, your helpful assistant. How can I help you today?";
        }

        if (this.isGreeting(cleanInput)) {
            const greetings = [
                "Hello! Nice to chat with you!",
                "Hi there! How can I assist you?",
                "Greetings! What would you like to discuss?",
            ];
            return this.randomChoice(greetings);
        }

        if (cleanInput.includes('weather')) {
            return "I don't have real-time weather data, but I can help you find weather information if you tell me your location!";
        }

        if (cleanInput.includes('time')) {
            return `The current time is ${new Date().toLocaleTimeString()}.`;
        }

        if (cleanInput.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }

        const responses = [
            "That's interesting! Tell me more about that.",
            "I understand. What specific information are you looking for?",
            "Great point! How can I help you explore this further?",
            "Thanks for sharing! What would you like to know about this?",
            "I see. Could you elaborate on that?",
            "Fascinating! What else would you like to discuss?"
        ];
        return this.randomChoice(responses);
    }

    isGreeting(text) {
        const greetings = ['hello', 'hi', 'hey', 'hii', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => text.includes(greeting));
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// App State
const ai = new HariAI();
let currentChatId = null;
let chatHistory = [];
let filteredChats = [];
let isUploadOptionsVisible = false;
let isProfileDropdownVisible = false;
let isTyping = false;
let longPressTimer = null;
let selectedChatId = null;
let isVoiceActive = false;
let recognition = null;

// Initialize App
function init() {
    console.log("Initializing app...");
    loadChatHistory();
    setupAutoResize();
    setupFileInputs();
    setupClickOutsideListener();
    setupLongPress();
    setupVoiceRecognition();
    
    // Create initial chat if no chats exist
    if (chatHistory.length === 0) {
        console.log("No chats found, creating initial chat...");
        createNewChat(false);
    } else {
        // Load the most recent chat
        console.log("Loading existing chats...");
        loadChat(chatHistory[0].id);
    }
    
    console.log("App initialized successfully!");
}

// Voice Recognition Setup
function setupVoiceRecognition() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            console.log("Voice recognition started");
            document.getElementById('voice-btn').classList.add('active');
            document.getElementById('voice-indicator').classList.add('visible');
            isVoiceActive = true;
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('user-input').value = transcript;
            console.log("Voice input:", transcript);
            
            // Auto-send the message after voice input
            setTimeout(() => {
                sendMessage();
            }, 500);
        };
        
        recognition.onerror = function(event) {
            console.error("Speech recognition error:", event.error);
            stopVoiceRecognition();
            
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone access to use voice input.');
            }
        };
        
        recognition.onend = function() {
            console.log("Voice recognition ended");
            stopVoiceRecognition();
        };
    } else {
        console.log("Speech recognition not supported in this browser");
        document.getElementById('voice-btn').style.display = 'none';
    }
}

function stopVoiceRecognition() {
    document.getElementById('voice-btn').classList.remove('active');
    document.getElementById('voice-indicator').classList.remove('visible');
    isVoiceActive = false;
}

// Voice Input Toggle
function toggleVoiceInput() {
    console.log("Voice button clicked");
    
    if (!recognition) {
        alert("Voice recognition is not supported in your browser");
        return;
    }
    
    if (isVoiceActive) {
        recognition.stop();
        stopVoiceRecognition();
    } else {
        try {
            recognition.start();
            console.log("Starting voice recognition...");
        } catch (error) {
            console.error("Error starting voice recognition:", error);
            alert("Error starting voice recognition. Please try again.");
        }
    }
}

// Profile Dropdown Functions
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (isProfileDropdownVisible) {
        dropdown.classList.remove('visible');
    } else {
        dropdown.classList.add('visible');
    }
    isProfileDropdownVisible = !isProfileDropdownVisible;
}

function hideProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.remove('visible');
    isProfileDropdownVisible = false;
}

// Account Settings Functions
function openAccountSettings() {
    hideProfileDropdown();
    const accountSettings = document.getElementById('account-settings');
    accountSettings.classList.add('visible');
}

function openAppearanceSettings() {
    hideProfileDropdown();
    const accountSettings = document.getElementById('account-settings');
    accountSettings.classList.add('visible');
    // Scroll to appearance section
    setTimeout(() => {
        document.querySelector('.settings-content').scrollTop = 300;
    }, 100);
}

function openLanguageSettings() {
    hideProfileDropdown();
    const accountSettings = document.getElementById('account-settings');
    accountSettings.classList.add('visible');
    // Scroll to language section
    setTimeout(() => {
        document.querySelector('.settings-content').scrollTop = 500;
    }, 100);
}

function closeAccountSettings() {
    const accountSettings = document.getElementById('account-settings');
    accountSettings.classList.remove('visible');
}

function sendVerificationCode() {
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone-number').value;
    
    if (!phoneNumber || phoneNumber.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    const fullNumber = countryCode + phoneNumber;
    
    // Simulate sending verification code
    const sendCodeBtn = document.getElementById('send-code-btn');
    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = 'Sending...';
    
    setTimeout(() => {
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = 'Send Verification Code';
        alert(`Verification code sent to ${fullNumber}\nDemo Code: 123456`);
    }, 2000);
}

function verifyLogin() {
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const code = document.getElementById('verification-code').value;
    const password = document.getElementById('password').value;
    
    const fullNumber = countryCode + phoneNumber;
    
    if (!phoneNumber || phoneNumber.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    if (!code || code.length !== 6) {
        alert('Please enter a valid 6-digit verification code');
        return;
    }
    
    if (!password) {
        alert('Please enter your password');
        return;
    }
    
    // Simulate verification
    if (code === '123456' && password.length >= 6) {
        alert(`Login successful for ${fullNumber}!`);
        closeAccountSettings();
        
        // Update profile icon to show logged in state
        document.querySelector('.sidebar-user-icon').textContent = '✓';
        document.querySelector('.sidebar-user-icon').style.background = '#10b981';
    } else {
        alert('Invalid verification code or password. Please try again.');
    }
}

function setTheme(theme) {
    // Remove active class from all theme options
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to selected theme
    event.target.closest('.theme-option').classList.add('active');
    
    // Apply theme (you can implement actual theme switching here)
    console.log('Theme set to:', theme);
    
    // Show confirmation
    alert(`Theme changed to ${theme} mode`);
}

function setLanguage(language) {
    // Remove active class from all language options
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to selected language
    event.target.closest('.language-option').classList.add('active');
    
    // Apply language (you can implement actual language switching here)
    console.log('Language set to:', language);
    
    // Show confirmation
    alert(`Language changed to ${language}`);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any login data
        document.getElementById('phone-number').value = '';
        document.getElementById('verification-code').value = '';
        document.getElementById('password').value = '';
        
        // Reset profile icon
        document.querySelector('.sidebar-user-icon').textContent = '👤';
        document.querySelector('.sidebar-user-icon').style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        alert('Logged out successfully!');
        hideProfileDropdown();
    }
}

function setupAutoResize() {
    const textarea = document.getElementById('user-input');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

function setupFileInputs() {
    // File input setup
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', handleFileUpload);
    
    // Image input setup
    const imageInput = document.getElementById('image-input');
    imageInput.addEventListener('change', handleImageUpload);
    
    // Camera input setup
    const cameraInput = document.getElementById('camera-input');
    cameraInput.addEventListener('change', handleCameraCapture);
}

function setupClickOutsideListener() {
    // Close upload options when clicking outside
    document.addEventListener('click', function(event) {
        const uploadOptions = document.getElementById('upload-options');
        const uploadBtn = document.getElementById('upload-btn');
        const contextMenu = document.getElementById('chat-context-menu');
        const profileDropdown = document.getElementById('profile-dropdown');
        const profileBtn = document.querySelector('.sidebar-profile-btn');
        const voiceBtn = document.getElementById('voice-btn');
        
        if (isUploadOptionsVisible && 
            !uploadOptions.contains(event.target) && 
            !uploadBtn.contains(event.target)) {
            hideUploadOptions();
        }
        
        // Close context menu when clicking outside
        if (!event.target.closest('.chat-item') && !contextMenu.contains(event.target)) {
            hideContextMenu();
        }
        
        // Close profile dropdown when clicking outside
        if (isProfileDropdownVisible && 
            !profileDropdown.contains(event.target) && 
            !profileBtn.contains(event.target)) {
            hideProfileDropdown();
        }
    });
}

function setupLongPress() {
    const chatList = document.getElementById('chat-history');
    
    chatList.addEventListener('touchstart', handleTouchStart);
    chatList.addEventListener('touchend', handleTouchEnd);
    chatList.addEventListener('mousedown', handleMouseDown);
    chatList.addEventListener('mouseup', handleMouseUp);
    chatList.addEventListener('mouseleave', handleMouseUp);
}

function handleTouchStart(e) {
    const chatItem = e.target.closest('.chat-item');
    if (chatItem) {
        selectedChatId = parseInt(chatItem.getAttribute('data-chat-id'));
        startLongPressTimer();
    }
}

function handleTouchEnd() {
    clearLongPressTimer();
}

function handleMouseDown(e) {
    if (e.button === 0) { // Left click only
        const chatItem = e.target.closest('.chat-item');
        if (chatItem) {
            selectedChatId = parseInt(chatItem.getAttribute('data-chat-id'));
            startLongPressTimer();
        }
    }
}

function handleMouseUp() {
    clearLongPressTimer();
}

function startLongPressTimer() {
    longPressTimer = setTimeout(() => {
        showContextMenu();
    }, 1000); // 1 second
}

function clearLongPressTimer() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
}

function showContextMenu() {
    const contextMenu = document.getElementById('chat-context-menu');
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${selectedChatId}"]`);
    
    if (chatItem) {
        const rect = chatItem.getBoundingClientRect();
        contextMenu.style.top = `${rect.bottom + 5}px`;
        contextMenu.style.left = `${rect.left}px`;
        contextMenu.classList.add('visible');
    }
}

function hideContextMenu() {
    const contextMenu = document.getElementById('chat-context-menu');
    contextMenu.classList.remove('visible');
    selectedChatId = null;
}

function pinChat() {
    if (selectedChatId) {
        const chat = chatHistory.find(c => c.id === selectedChatId);
        if (chat) {
            chat.pinned = !chat.pinned;
            saveChatHistory();
            renderChatHistory();
            hideContextMenu();
        }
    }
}

function renameChat() {
    if (selectedChatId) {
        const chat = chatHistory.find(c => c.id === selectedChatId);
        if (chat) {
            const newTitle = prompt('Enter new chat name:', chat.title);
            if (newTitle && newTitle.trim()) {
                chat.title = newTitle.trim();
                if (currentChatId === selectedChatId) {
                    document.getElementById('conversation-title').value = chat.title;
                }
                saveChatHistory();
                renderChatHistory();
            }
            hideContextMenu();
        }
    }
}

function deleteChat() {
    if (selectedChatId && confirm('Are you sure you want to delete this chat?')) {
        chatHistory = chatHistory.filter(c => c.id !== selectedChatId);
        filteredChats = filteredChats.filter(c => c.id !== selectedChatId);
        
        if (currentChatId === selectedChatId) {
            if (chatHistory.length > 0) {
                loadChat(chatHistory[0].id);
            } else {
                createNewChat(false);
            }
        }
        
        saveChatHistory();
        renderChatHistory();
        updateStats();
        hideContextMenu();
    }
}

// Upload Functions
function toggleUploadOptions(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const uploadOptions = document.getElementById('upload-options');
    const uploadBtn = document.getElementById('upload-btn');
    
    if (isUploadOptionsVisible) {
        hideUploadOptions();
    } else {
        showUploadOptions();
    }
}

function showUploadOptions() {
    const uploadOptions = document.getElementById('upload-options');
    const uploadBtn = document.getElementById('upload-btn');
    
    uploadOptions.classList.add('visible');
    uploadBtn.classList.add('active');
    isUploadOptionsVisible = true;
}

function hideUploadOptions() {
    const uploadOptions = document.getElementById('upload-options');
    const uploadBtn = document.getElementById('upload-btn');
    
    uploadOptions.classList.remove('visible');
    uploadBtn.classList.remove('active');
    isUploadOptionsVisible = false;
}

function uploadFiles() {
    hideUploadOptions();
    document.getElementById('file-input').click();
}

function uploadImage() {
    hideUploadOptions();
    document.getElementById('image-input').click();
}

function openNativeCamera() {
    hideUploadOptions();
    document.getElementById('camera-input').click();
}

// File Upload Handler
function handleFileUpload(event) {
    console.log("File upload triggered", event.target.files);
    const files = event.target.files;
    if (files.length > 0) {
        for (let file of files) {
            processFileUpload(file);
        }
        // Reset input for next upload
        event.target.value = '';
    }
}

function processFileUpload(file) {
    console.log("Processing file:", file.name);
    
    // Format file size
    const fileSize = formatFileSize(file.size);
    
    // Create file item with actions
    const fileHTML = `
        <div class="file-item">
            <div class="file-icon">📄</div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
        </div>
    `;
    
    // Add file message to chat
    addMessage('user', `📁 <strong>Uploaded file:</strong> ${file.name}`);
    addMessage('user', fileHTML, false);
    
    setTimeout(() => {
        const response = `I've received your file "${file.name}". I can help you analyze or work with this document. What would you like me to do with it?`;
        addMessage('ai', response);
        saveChatHistory();
    }, 1000);
}

function handleImageUpload(event) {
    console.log("Image upload triggered", event.target.files);
    const files = event.target.files;
    if (files.length > 0) {
        for (let file of files) {
            processImageUpload(file);
        }
        // Reset input for next upload
        event.target.value = '';
    }
}

function processImageUpload(file) {
    console.log("Processing image:", file.name);
    const reader = new FileReader();
    
    reader.onload = function(e) {
        console.log("Image loaded successfully");
        
        // Create image with actions
        const imageHTML = `
            <div style="margin: 10px 0;">
                <img src="${e.target.result}" class="uploaded-image" alt="${file.name}" style="max-width: 300px; border-radius: 8px; margin-top: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            </div>
        `;
        
        // Add image message to chat
        addMessage('user', `🖼️ <strong>Uploaded image:</strong> ${file.name}`);
        addMessage('user', imageHTML, false);
        
        setTimeout(() => {
            const response = `I can see the image "${file.name}" you've uploaded! It looks great. How would you like me to help you analyze or work with this image?`;
            addMessage('ai', response);
            saveChatHistory();
        }, 1000);
    };
    
    reader.onerror = function(e) {
        console.error("Error reading image file:", e);
        addMessage('user', `❌ Error uploading image: ${file.name}`);
    };
    
    reader.readAsDataURL(file);
}

function handleCameraCapture(event) {
    console.log("Camera capture triggered", event.target.files);
    const file = event.target.files[0];
    if (file) {
        processCameraCapture(file);
        // Reset input for next capture
        event.target.value = '';
    }
}

function processCameraCapture(file) {
    console.log("Processing camera capture:", file.name);
    const reader = new FileReader();
    
    reader.onload = function(e) {
        console.log("Camera image loaded successfully");
        const imageHTML = `
            <div style="margin: 10px 0;">
                <img src="${e.target.result}" class="uploaded-image" alt="Captured photo" style="max-width: 300px; border-radius: 8px; margin-top: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            </div>
        `;
        
        // Add camera message to chat
        addMessage('user', `📷 <strong>Captured a photo</strong>`);
        addMessage('user', imageHTML, false);
        
        setTimeout(() => {
            const response = `Great photo! I can see the image you've captured. How would you like me to help you with this?`;
            addMessage('ai', response);
            saveChatHistory();
        }, 1000);
    };
    
    reader.onerror = function(e) {
        console.error("Error reading camera file:", e);
        addMessage('user', `❌ Error processing captured photo`);
    };
    
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function toggleChatHistory() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('visible');
    overlay.classList.toggle('visible');
    
    document.body.style.overflow = sidebar.classList.contains('visible') ? 'hidden' : '';
    
    // Clear search when opening sidebar
    if (sidebar.classList.contains('visible')) {
        document.getElementById('search-input').value = '';
        filterChatHistory('');
    }
}

function createNewChat(showToast = true) {
    console.log("Creating new chat...");
    
    // Generate unique ID based on timestamp to avoid conflicts
    currentChatId = Date.now();
    
    // Get the next chat number (unlimited)
    const nextChatNumber = chatHistory.length + 1;
    const title = `Chat ${nextChatNumber.toString().padStart(3, '0')}`;
    
    const newChat = {
        id: currentChatId,
        title: title,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [],
        pinned: false,
        created: new Date().toISOString()
    };
    
    // Add to beginning of array (most recent first)
    chatHistory.unshift(newChat);
    filteredChats = [...chatHistory];
    
    // Update UI
    document.getElementById('conversation-title').value = title;
    document.getElementById('chat-messages').innerHTML = '';
    document.getElementById('user-input').value = '';
    
    // Reset textarea height
    document.getElementById('user-input').style.height = 'auto';
    
    // Update chat list
    renderChatHistory();
    
    // Add welcome message
    addWelcomeMessage();
    
    // Update stats
    updateStats();
    
    // Save to localStorage
    saveChatHistory();
    
    console.log("New chat created:", newChat);
}

function filterChatHistory(searchTerm) {
    const searchLower = searchTerm.toLowerCase().trim();
    console.log("Searching for:", searchLower);
    
    if (searchLower === '') {
        filteredChats = [...chatHistory];
    } else {
        filteredChats = chatHistory.filter(chat => {
            // Search in title
            if (chat.title.toLowerCase().includes(searchLower)) {
                return true;
            }
            
            // Search in messages
            if (chat.messages && chat.messages.length > 0) {
                return chat.messages.some(msg => {
                    const content = msg.content || msg.text || '';
                    return content.toLowerCase().includes(searchLower);
                });
            }
            
            return false;
        });
    }
    
    console.log("Found", filteredChats.length, "chats");
    renderChatHistory();
}

function loadChatHistory() {
    console.log("Loading chat history from localStorage...");
    
    // Load from localStorage if available
    const savedChats = localStorage.getItem('hariChatHistory');
    if (savedChats) {
        try {
            const parsedChats = JSON.parse(savedChats);
            chatHistory = Array.isArray(parsedChats) ? parsedChats : [];
            
            console.log(`Loaded ${chatHistory.length} chats from storage`);
            
            // Ensure we have a valid currentChatId
            if (chatHistory.length > 0 && !currentChatId) {
                currentChatId = chatHistory[0].id;
            }
        } catch (e) {
            console.error('Error loading chat history:', e);
            chatHistory = [];
        }
    } else {
        console.log("No saved chats found in localStorage");
        chatHistory = [];
    }
    
    filteredChats = [...chatHistory];
    renderChatHistory();
    updateStats();
}

function saveChatHistory() {
    try {
        localStorage.setItem('hariChatHistory', JSON.stringify(chatHistory));
        console.log(`Saved ${chatHistory.length} chats to localStorage`);
    } catch (e) {
        console.error('Error saving chat history:', e);
    }
}

function renderChatHistory() {
    const historyContainer = document.getElementById('chat-history');
    historyContainer.innerHTML = '';
    
    if (filteredChats.length === 0) {
        historyContainer.innerHTML = '<div class="no-results">No chats found</div>';
        return;
    }
    
    const sortedChats = [...filteredChats].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.created) - new Date(a.created);
    });
    
    sortedChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chat.pinned ? 'pinned' : ''} ${chat.id === currentChatId ? 'active' : ''}`;
        chatItem.setAttribute('data-chat-id', chat.id);
        
        const messageCount = chat.messages ? chat.messages.length : 0;
        
        chatItem.innerHTML = `
            <div class="chat-title">
                ${chat.pinned ? '📌' : ''} ${chat.title}
            </div>
            <div class="chat-time">${chat.timestamp} • ${messageCount} messages</div>
        `;
        
        // FIXED: Properly bind the click event to load the chat
        chatItem.addEventListener('click', function(e) {
            console.log("Chat clicked:", chat.id);
            loadChat(chat.id);
        });
        
        historyContainer.appendChild(chatItem);
    });
}

function updateStats() {
    const statsElement = document.getElementById('chat-stats');
    const totalChats = chatHistory.length;
    const totalMessages = chatHistory.reduce((total, chat) => total + (chat.messages ? chat.messages.length : 0), 0);
    const pinnedChats = chatHistory.filter(chat => chat.pinned).length;
    
    statsElement.innerHTML = `
        ${totalChats} chats • ${totalMessages} messages • ${pinnedChats} pinned
    `;
}

function loadChat(chatId) {
    console.log("Loading chat:", chatId);
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
        currentChatId = chatId;
        document.getElementById('conversation-title').value = chat.title;
        document.getElementById('chat-messages').innerHTML = '';
        
        // Load messages
        if (chat.messages && chat.messages.length > 0) {
            chat.messages.forEach(msg => {
                addMessage(msg.sender, msg.content || msg.text, false);
            });
        } else {
            addWelcomeMessage();
        }
        
        // Update chat history display
        renderChatHistory();
        
        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            toggleChatHistory();
        }
        
        console.log("Chat loaded successfully:", chat.title);
    } else {
        console.error("Chat not found:", chatId);
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage('user', message);
    input.value = '';
    input.style.height = 'auto';
    
    // Disable send button while processing
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    sendBtn.textContent = '...';
    
    // Show typing indicator
    showTypingIndicator();
    
    setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();
        
        const response = ai.getResponse(message);
        addMessage('ai', response);
        
        // Re-enable send button
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        
        // Save chat history after sending message
        saveChatHistory();
        updateStats();
    }, 1000 + Math.random() * 1000);
}

function showTypingIndicator() {
    if (isTyping) return;
    
    const chat = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="avatar ai-avatar">AI</div>
        <div class="sender-name">Hari AI</div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
    isTyping = true;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

function addMessage(sender, content, saveToHistory = true) {
    const chat = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'ai' ? 
        '<div class="avatar ai-avatar">AI</div>' : 
        '<div class="avatar user-avatar">You</div>';
    
    const senderName = sender === 'ai' ? 'Hari AI' : 'You';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            ${avatar}
            <div class="sender-name">${senderName}</div>
        </div>
        <div class="message-content">${content}</div>
    `;
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
    
    if (saveToHistory && currentChatId) {
        const currentChat = chatHistory.find(c => c.id === currentChatId);
        if (currentChat) {
            if (!currentChat.messages) {
                currentChat.messages = [];
            }
            currentChat.messages.push({ 
                sender, 
                content,
                text: content,
                timestamp: new Date().toISOString()
            });
        }
    }
}

function addWelcomeMessage() {
    addMessage('ai', "Hello! I'm Hari AI, your intelligent assistant. I can help you with questions, creative tasks, problem-solving, and much more. What would you like to explore today?");
}

// Event Listeners
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Handle page refresh
window.addEventListener('beforeunload', function() {
    saveChatHistory();
});
