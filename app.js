class PromptsApp {
  constructor() {
    console.log('PromptsApp constructor called');
    console.log('window.educationalPrompts exists:', !!window.educationalPrompts);
    this.prompts = window.educationalPrompts || [];
    console.log('Loaded prompts count:', this.prompts.length);
    this.currentPrompt = null;
    this.animating = false;
    this.recentPrompts = this.loadRecentPrompts();
    this.init();
  }

  init() {
    this.renderRecentPrompts();
    this.renderPrompts();
    this.setupRecentPromptsHandlers();
  }

  // Recent Prompts Management
  loadRecentPrompts() {
    try {
      const recent = localStorage.getItem('recent-prompts');
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error('Error loading recent prompts:', error);
      return [];
    }
  }

  saveRecentPrompts() {
    try {
      localStorage.setItem('recent-prompts', JSON.stringify(this.recentPrompts));
    } catch (error) {
      console.error('Error saving recent prompts:', error);
    }
  }

  addToRecentPrompts(prompt) {
    // Remove if already exists
    this.recentPrompts = this.recentPrompts.filter(p => p.id !== prompt.id);
    
    // Add to beginning
    this.recentPrompts.unshift({
      ...prompt,
      lastUsed: new Date().toISOString()
    });
    
    // Keep only last 6
    this.recentPrompts = this.recentPrompts.slice(0, 6);
    
    this.saveRecentPrompts();
    this.renderRecentPrompts();
  }

  clearRecentPrompts() {
    this.recentPrompts = [];
    this.saveRecentPrompts();
    this.renderRecentPrompts();
  }

  renderRecentPrompts() {
    const section = document.getElementById('recentPromptsSection');
    const grid = document.getElementById('recentPromptsGrid');
    
    if (!section || !grid) return;
    
    if (this.recentPrompts.length === 0) {
      section.style.display = 'none';
      return;
    }
    
    section.style.display = 'block';
    grid.innerHTML = '';
    
    this.recentPrompts.forEach(prompt => {
      this.renderPromptCard(prompt, grid, true);
    });
  }

  setupRecentPromptsHandlers() {
    const clearBtn = document.getElementById('clearRecentBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearRecentPrompts();
      });
    }
  }

  renderPrompts() {
    console.log('Rendering prompts, count:', this.prompts.length);
    const grid = document.getElementById('strategiesGrid');
    
    if (!grid) {
      console.error('Missing grid');
      return;
    }

    grid.innerHTML = '';
    this.prompts.forEach(prompt => {
      this.renderPromptCard(prompt, grid, false);
    });
  }

  renderPromptCard(prompt, container, isRecent = false) {
    const template = document.getElementById('strategyCardTemplate');
    if (!template) {
      console.error('Missing template');
      return;
    }

    const frag = template.content.cloneNode(true);
    const card = frag.querySelector('.strategy-card');
    card.setAttribute('data-strategy-id', prompt.id);
    
    // Add recent indicator
    if (isRecent) {
      card.classList.add('recent-prompt');
    }
    
    card.querySelector('.card-title').textContent = prompt.title || '';
    card.querySelector('.card-description').textContent = prompt.description || '';
    const catEl = card.querySelector('.category-tag');
    if (catEl) catEl.textContent = prompt.category || '';

    // Add author information
    const authorEl = card.querySelector('.card-author');
    if (authorEl && prompt.author) {
      authorEl.textContent = `By ${prompt.author}`;
      authorEl.style.display = 'block';
    }

    // Add chapter information if available
    const chapterEl = card.querySelector('.card-chapter');
    if (chapterEl && prompt.chapter) {
      chapterEl.textContent = prompt.chapter;
      chapterEl.style.display = 'block';
    }

    // "Try This Prompt" -> full-screen chat + track usage
    const exploreBtn = card.querySelector('.explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToRecentPrompts(prompt); // Track usage
        this.expandCard(card, prompt, 'chat');
      });
    }

    // "View Example" -> in-flow expansion
    const detailsBtn = card.querySelector('.details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.expandCard(card, prompt, 'details');
      });
    }

    container.appendChild(frag);
  }

  /* In-flow & full-screen expansion using View Transitions (with FLIP fallback)
     mode: 'chat' | 'details' | 'collapse'
  */
  expandCard(card, prompt, mode = 'chat') {
    console.log('expandCard called with mode:', mode, 'prompt:', prompt?.title);
    if (!card || this.animating) {
      console.log('Blocked: card missing or animating');
      return;
    }
    const grid = document.getElementById('strategiesGrid');
    if (!grid) {
      console.error('Grid not found');
      return;
    }

    const isChatMode    = mode === 'chat';
    const isDetailsMode = mode === 'details';
    const isCollapse    = mode === 'collapse';

    this.currentPrompt = prompt || this.currentPrompt;
    this.animating = true;

    // swap content per mode
    const injectContent = () => {
      console.log('injectContent called, removing existing areas');
      card.querySelector('.chat-area')?.remove();
      card.querySelector('.details-area')?.remove();

      if (isCollapse) {
        console.log('Collapsing - cleaning up card');
        card.removeAttribute('data-mode');
        return;
      }

      if (isChatMode) {
        console.log('Creating chat area');
        const chat = this.createChatArea(this.currentPrompt || {});
        card.appendChild(chat);
        card.setAttribute('data-mode', 'chat');
        console.log('Chat area added to card');
      } else if (isDetailsMode) {
        console.log('Creating details area');
        const details = this.createDetailsArea(this.currentPrompt || {});
        card.appendChild(details);
        card.setAttribute('data-mode', 'details');
        console.log('Details area added to card');
      }
    };

    // Determine if we're expanding or switching/collapsing
    const isCurrentlyFull = card.classList.contains('expanded-full');
    const isCurrentlyDetails = card.classList.contains('expanded-details');
    const isExpandingNew =
      (isChatMode && !isCurrentlyFull) ||
      (isDetailsMode && !isCurrentlyDetails);

    const runToggle = () => {
      console.log('runToggle called, mode:', mode);
      // Remove all expansion classes first
      card.classList.remove('expanded-full', 'expanded-details');
      grid.classList.remove('expanded');
      console.log('Removed existing classes');

      if (isCollapse) {
        console.log('Collapsing card');
        injectContent(); // Clean up the card content
        return;
      }

      if (isChatMode) {
        console.log('Adding chat mode classes');
        grid.classList.add('expanded');      // dim siblings
        card.classList.add('expanded-full'); // full-screen
        console.log('Added expanded-full class to card');
      } else if (isDetailsMode) {
        console.log('Adding details mode classes');
        // in-flow wide card; no grid dimming
        card.classList.add('expanded-details');
        console.log('Added expanded-details class to card');
      }

      console.log('Calling injectContent');
      injectContent();
    };

    const finish = () => {
      grid.classList.remove('expanding');
      this.animating = false;
      if (!card.classList.contains('expanded-full') &&
          !card.classList.contains('expanded-details')) {
        this.currentPrompt = null;
      }
    };

    // View Transitions when available
    if (document.startViewTransition) {
      const t = document.startViewTransition(() => {
        grid.classList.toggle('expanding', true);
        runToggle();
      });
      t.finished.finally(finish);
      return;
    }

    // ---- FLIP fallback ----
    const cards = Array.from(grid.querySelectorAll('.strategy-card'));
    const firstRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));

    grid.classList.toggle('expanding', true);
    runToggle();

    const lastRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));

    cards.forEach(c => {
      const first = firstRects.get(c);
      const last  = lastRects.get(c);
      const dx = first.left - last.left;
      const dy = first.top  - last.top;
      const sx = first.width  / last.width;
      const sy = first.height / last.height;

      c.style.transformOrigin = 'top left';
      c.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    });

    requestAnimationFrame(() => {
      cards.forEach(c => {
        c.style.transition = 'transform 450ms cubic-bezier(.2,.8,.2,1)';
        c.style.transform = 'none';
      });

      const cleanup = () => {
        cards.forEach(c => {
          c.style.transition = '';
          c.style.transform = '';
        });
        finish();
        grid.removeEventListener('transitionend', cleanup);
      };
      grid.addEventListener('transitionend', cleanup, { once: true });
    });
  }

  closeExpandedCard(card) {
    if (!card) return;
    if (card.classList.contains('expanded-full') || card.classList.contains('expanded-details')) {
      this.expandCard(card, this.currentPrompt, 'collapse');
    }
  }

  createChatArea(prompt) {
    const chatArea = document.createElement('div');
    chatArea.className = 'chat-area';
    const title = prompt?.title || 'Prompt';

    chatArea.innerHTML = `
      <div class="chat-header">
        <h3 class="card-title" style="margin:0">Chat with AI</h3>
        <div style="display:flex; gap:.5rem;">
          <button class="btn details-btn" data-switch="details">View Example</button>
          <button class="close-expanded btn-ghost" aria-label="Close">← Back</button>
        </div>
      </div>
      <div class="chat-body">
        <div class="prompt-blurb">
          <strong>Selected Prompt:</strong>
          <p class="card-description" style="margin:.25rem 0 0 0">${title}</p>
        </div>
        <div class="input-group">
          <input type="text" id="chatInput" placeholder="Type your message..." class="chat-input" disabled>
          <button id="sendMessage" class="btn btn-primary" disabled>Send</button>
        </div>
      </div>
    `;

    chatArea.querySelector('.close-expanded')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = chatArea.closest('.strategy-card');
      this.closeExpandedCard(parentCard);
    });

    chatArea.querySelector('[data-switch="details"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = chatArea.closest('.strategy-card');
      this.expandCard(parentCard, this.currentPrompt, 'details');
    });

    // Initialize chat functionality
    this.initializeChat(chatArea, prompt);

    return chatArea;
  }

  createDetailsArea(prompt) {
    const details = document.createElement('div');
    details.className = 'details-area';
    const {
      title = 'Prompt',
      description = '',
      category = '',
      author = '',
      chapter = '',
      difficulty = '',
      time = '',
      tags = []
    } = prompt || {};

    const tagChips = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);
    const chipsHTML = tagChips.filter(Boolean).map(t => `<span class="card-tag">${t}</span>`).join('');

    details.innerHTML = `
      <div class="chat-header">
        <h3 class="card-title" style="margin:0">About this prompt</h3>
        <div style="display:flex; gap:.5rem;">
          <button class="btn btn-primary" data-switch="chat">Try This Prompt</button>
          <button class="close-expanded btn-ghost" aria-label="Close">← Back</button>
        </div>
      </div>

      <div class="chat-body">
        <div>
          <h4 style="margin:.25rem 0 0 0; font-weight:800">${title}</h4>
          <p class="card-description" style="margin:.35rem 0 0 0">${description}</p>
          ${author ? `<div class="card-author" style="display:block; margin-top:.5rem;">By ${author}</div>` : ''}
          ${chapter ? `<div class="card-chapter" style="display:block; margin-top:.25rem;">${chapter}</div>` : ''}
        </div>

        ${prompt?.prompt ? `
        <div class="prompt-preview" style="margin-top:1.5rem;">
          <h5 style="margin:0 0 .5rem 0; font-weight:700; color:var(--ivey-green);">The Prompt:</h5>
          <div style="background:#f8fffe; padding:1rem; border-radius:12px; border-left:3px solid var(--ivey-green); font-style:italic; line-height:1.6;">
            "${prompt.prompt}"
          </div>
        </div>` : ''}

        <div class="card-meta" style="margin-top:1rem;">
          ${category ? `<span class="category-tag">${category}</span>` : ''}
          ${difficulty ? `<span class="card-tag">${difficulty}</span>` : ''}
          ${time ? `<span class="card-tag">${time}</span>` : ''}
        </div>

        ${chipsHTML ? `<div class="card-tags" style="margin-top:.75rem;"><strong style="font-size:.85rem; color:var(--ivey-gray-10); margin-right:.5rem;">Tags:</strong>${chipsHTML}</div>` : ''}
      </div>
    `;

    details.querySelector('.close-expanded')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = details.closest('.strategy-card');
      this.closeExpandedCard(parentCard);
    });

    details.querySelector('[data-switch="chat"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = details.closest('.strategy-card');
      this.expandCard(parentCard, this.currentPrompt, 'chat');
    });

    return details;
  }

  initializeChat(chatArea, prompt) {
    const chatInput = chatArea.querySelector('#chatInput');
    const sendButton = chatArea.querySelector('#sendMessage');
    
    if (!chatInput || !sendButton) {
      console.error('Chat input or send button not found');
      return;
    }

    // Enable the input and button
    chatInput.disabled = false;
    sendButton.disabled = false;

    // Create messages container if it doesn't exist
    let messagesContainer = chatArea.querySelector('.chat-messages');
    if (!messagesContainer) {
      messagesContainer = document.createElement('div');
      messagesContainer.className = 'chat-messages';
      chatArea.querySelector('.chat-body').insertBefore(messagesContainer, chatArea.querySelector('.input-group'));
    }

    // Get AI-powered initial message based on the prompt
    this.generateIntelligentInitialResponse(messagesContainer, prompt);

    // Set up send functionality
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (message) {
        this.addMessage(messagesContainer, 'user', message);
        chatInput.value = '';
        this.handleUserMessage(messagesContainer, message);
      }
    };

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  addMessage(container, sender, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }

  async handleUserMessage(container, message) {
    // Show typing indicator
    this.addMessage(container, 'ai', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Remove typing indicator
    const messages = container.querySelectorAll('.message');
    if (messages.length > 0) {
      container.removeChild(messages[messages.length - 1]);
    }
    
    // Generate contextual AI response
    const response = await this.generateContextualResponse(message);
    this.addMessage(container, 'ai', response);
  }

  async generateIntelligentInitialResponse(container, prompt) {
    // Show loading message
    this.addMessage(container, 'ai', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
    
    try {
      const initializationMessage = `You are an expert educational AI assistant. A user is about to try this educational prompt: "${prompt?.prompt || ''}"

The prompt is titled: "${prompt?.title || ''}" and is designed to: ${prompt?.description || ''}

Please provide a welcoming and helpful initial response that:
1. Briefly acknowledges what this prompt does
2. Asks the user for the specific information needed to use this prompt effectively
3. Is encouraging and clear about what they should provide

Keep it conversational and helpful, like a friendly expert educator would.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: initializationMessage,
          prompt: 'You are a helpful educational AI assistant that guides users through educational prompts.'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.message || 'Hello! I\'m ready to help you with this educational prompt. What would you like to get started with?';

      // Remove loading indicator and add actual response
      const messages = container.querySelectorAll('.message');
      if (messages.length > 0) {
        container.removeChild(messages[messages.length - 1]);
      }
      
      this.addMessage(container, 'ai', aiMessage);
      
    } catch (error) {
      console.error('Failed to generate initial response:', error);
      
      // Remove loading indicator and add fallback
      const messages = container.querySelectorAll('.message');
      if (messages.length > 0) {
        container.removeChild(messages[messages.length - 1]);
      }
      
      this.addMessage(container, 'ai', 'Hello! I\'m ready to help you with this educational prompt. What information would you like to provide to get started?');
    }
  }

  async generateContextualResponse(userMessage) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          prompt: this.currentPrompt?.prompt || 'You are a helpful educational assistant.'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.message || 'I apologize, but I encountered an error processing your request.';
    } catch (error) {
      console.error('API call failed:', error);
      return 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again later.';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new PromptsApp());
