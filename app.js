class PromptsApp {
  constructor() {
    console.log('PromptsApp constructor called');
    console.log('window.educationalPrompts exists:', !!window.educationalPrompts);
    this.prompts = window.educationalPrompts || [];
    console.log('Loaded prompts count:', this.prompts.length);
    this.currentPrompt = null;
    this.animating = false;
    this.init();
  }

  init() {
    this.renderPrompts();
  }

  renderPrompts() {
    console.log('Rendering prompts, count:', this.prompts.length);
    const grid = document.getElementById('strategiesGrid');
    const template = document.getElementById('strategyCardTemplate');
    if (!grid || !template) {
      console.error('Missing grid or template');
      return;
    }

    grid.innerHTML = '';
    this.prompts.forEach((prompt, index) => {
      console.log(`Rendering prompt ${index}:`, prompt.title);
      const frag = template.content.cloneNode(true);
      const card = frag.querySelector('.strategy-card');
      card.setAttribute('data-strategy-id', prompt.id);
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

      // "Try This Prompt" -> full-screen chat
      const exploreBtn = card.querySelector('.explore-btn');
      if (exploreBtn) {
        console.log('Adding click listener to explore button');
        exploreBtn.addEventListener('click', (e) => {
          console.log('Explore button clicked!');
          e.stopPropagation();
          this.expandCard(card, prompt, 'chat');  // full-screen
        });
      } else {
        console.error('Explore button not found');
      }

      // "View Details" -> in-flow expansion
      const detailsBtn = card.querySelector('.details-btn');
      if (detailsBtn) {
        console.log('Adding click listener to details button');
        detailsBtn.addEventListener('click', (e) => {
          console.log('Details button clicked!');
          e.stopPropagation();
          this.expandCard(card, prompt, 'details'); // in-flow
        });
      } else {
        console.error('Details button not found');
      }

      grid.appendChild(frag);
    });
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

    // Add initial AI message
    this.addMessage(messagesContainer, 'ai', this.generateInitialResponse(prompt?.prompt || ''));

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

  generateInitialResponse(promptText) {
    const prompt = this.currentPrompt;
    
    // Context-aware responses based on the specific prompt
    if (prompt?.title?.includes('Generate Explanations, Examples, and Analogies')) {
      return "I'm ready to create clear explanations with examples and analogies! To get started, I need two pieces of information:<br><br><strong>1. What concept would you like me to explain?</strong><br><strong>2. Who is your target audience?</strong> (e.g., high school students, college freshmen, professionals, etc.)<br><br>Just tell me these details and I'll provide a comprehensive explanation with examples and 5 different analogies!";
    } else if (prompt?.title?.includes('Improve Class Slides')) {
      return "I'm ready to help improve your PowerPoint presentation! Please share your slides or describe your current presentation content, and I'll give you specific, slide-by-slide recommendations to make them more engaging and pedagogically effective.";
    } else if (prompt?.title?.includes('Generate Engaging In-Class Activities')) {
      return "I'll help you add active learning activities to your class! Please share your class materials, learning objectives, or lesson plan, and I'll suggest 5-10 minute activities you can insert to boost student engagement.";
    } else if (prompt?.title?.includes('Student Learning Template')) {
      return "I'm ready to create a personalized learning template! What subject or concept would you like me to help your students learn? I'll provide a structured approach they can follow.";
    } else if (prompt?.title?.includes('Diagnostic Quiz')) {
      return "Let's create a diagnostic quiz to assess student understanding! What specific topic, concept, or learning objective should this quiz test? I'll create questions that reveal common misconceptions and knowledge gaps.";
    } else if (prompt?.title?.includes('Teaching Assistant')) {
      return "I'm your AI teaching assistant! What would you like help with today? I can help with lesson planning, grading rubrics, student questions, or any other teaching-related task.";
    } else if (promptText?.includes('ask me two questions') || promptText?.includes('ask me')) {
      return "I'm ready to help! To get started, please provide the key information this prompt needs, and I'll ask the right follow-up questions.";
    } else {
      return `I'm ready to help you use this educational prompt! Based on the prompt requirements, please share the specific details or context you'd like me to work with, and I'll provide a tailored response.`;
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
