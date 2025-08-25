class PromptsApp {
  constructor() {
    console.log('PromptsApp constructor called');
    console.log('window.educationalPrompts exists:', !!window.educationalPrompts);
    this.prompts = window.educationalPrompts || [];
    console.log('Loaded prompts count:', this.prompts.length);
    this.currentPrompt = null;
    this.animating = false;
    this.recentPrompts = this.loadRecentPrompts();
    this.activeChain = this.loadActiveChain();
    this.promptChains = this.initializePromptChains();
    this.init();
  }

  init() {
    this.renderRecentPrompts();
    this.renderPrompts();
    this.setupRecentPromptsHandlers();
    this.setupChainHandlers();
    if (this.activeChain) {
      this.showChainProgress();
    }
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

  // Prompt Chain Management
  initializePromptChains() {
    return {
      'lesson-planning': {
        name: 'Complete Lesson Planning',
        description: 'Design a comprehensive lesson from start to finish',
        steps: [
          'Generate Explanations, Examples, and Analogies',
          'Generate Engaging In-Class Activities', 
          'Design Assessment Questions',
          'Create Effective Rubrics'
        ]
      },
      'content-development': {
        name: 'Content Creation Workflow',
        description: 'Develop and refine educational content',
        steps: [
          'Generate Explanations, Examples, and Analogies',
          'Improve Class Slides',
          'Generate Engaging In-Class Activities',
          'Diagnostic Quiz Generator'
        ]
      },
      'assessment-focused': {
        name: 'Assessment Development',
        description: 'Create comprehensive student assessments',
        steps: [
          'Design Assessment Questions',
          'Create Effective Rubrics',
          'Diagnostic Quiz Generator',
          'Teaching Assistant'
        ]
      }
    };
  }

  loadActiveChain() {
    try {
      const chain = localStorage.getItem('active-prompt-chain');
      return chain ? JSON.parse(chain) : null;
    } catch (error) {
      console.error('Error loading active chain:', error);
      return null;
    }
  }

  saveActiveChain() {
    try {
      localStorage.setItem('active-prompt-chain', JSON.stringify(this.activeChain));
    } catch (error) {
      console.error('Error saving active chain:', error);
    }
  }

  startPromptChain(chainKey, startingPromptId) {
    const chain = this.promptChains[chainKey];
    if (!chain) return;

    this.activeChain = {
      chainKey,
      name: chain.name,
      steps: chain.steps,
      currentStep: 0,
      completedSteps: [],
      startedAt: new Date().toISOString()
    };

    // Mark the starting prompt as current
    const currentPromptTitle = chain.steps[0];
    const currentPrompt = this.prompts.find(p => p.title === currentPromptTitle);
    if (currentPrompt) {
      this.activeChain.currentPromptId = currentPrompt.id;
    }

    this.saveActiveChain();
    this.showChainProgress();
  }

  advanceChain() {
    if (!this.activeChain) return;

    // Mark current step as completed
    this.activeChain.completedSteps.push(this.activeChain.currentStep);
    this.activeChain.currentStep++;

    // Check if chain is complete
    if (this.activeChain.currentStep >= this.activeChain.steps.length) {
      this.completeChain();
      return;
    }

    // Set next prompt
    const nextPromptTitle = this.activeChain.steps[this.activeChain.currentStep];
    const nextPrompt = this.prompts.find(p => p.title === nextPromptTitle);
    if (nextPrompt) {
      this.activeChain.currentPromptId = nextPrompt.id;
    }

    this.saveActiveChain();
    this.showChainProgress();
  }

  completeChain() {
    const chainName = this.activeChain.name;
    this.activeChain = null;
    localStorage.removeItem('active-prompt-chain');
    this.hideChainProgress();
    
    // Show completion message
    alert(`🎉 Congratulations! You've completed the "${chainName}" workflow. Great job building comprehensive educational materials!`);
  }

  showChainProgress() {
    const section = document.getElementById('chainProgressSection');
    const title = document.getElementById('chainTitle');
    const description = document.getElementById('chainDescription');
    const steps = document.getElementById('chainSteps');
    
    if (!section || !this.activeChain) return;
    
    const chain = this.promptChains[this.activeChain.chainKey];
    
    title.textContent = chain.name;
    description.textContent = chain.description;
    
    // Render steps
    steps.innerHTML = '';
    this.activeChain.steps.forEach((stepTitle, index) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'chain-step';
      stepEl.textContent = `${index + 1}. ${stepTitle}`;
      
      if (this.activeChain.completedSteps.includes(index)) {
        stepEl.classList.add('completed');
      } else if (index === this.activeChain.currentStep) {
        stepEl.classList.add('current');
      }
      
      steps.appendChild(stepEl);
    });
    
    section.style.display = 'block';
  }

  hideChainProgress() {
    const section = document.getElementById('chainProgressSection');
    if (section) {
      section.style.display = 'none';
    }
  }

  setupChainHandlers() {
    const cancelBtn = document.getElementById('chainCancelBtn');
    const nextBtn = document.getElementById('chainNextBtn');
    
    cancelBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this workflow? Your progress will be lost.')) {
        this.activeChain = null;
        localStorage.removeItem('active-prompt-chain');
        this.hideChainProgress();
      }
    });
    
    nextBtn?.addEventListener('click', () => {
      this.advanceChain();
      
      // Auto-navigate to next prompt
      if (this.activeChain) {
        const nextPrompt = this.prompts.find(p => p.id === this.activeChain.currentPromptId);
        if (nextPrompt) {
          const nextCard = document.querySelector(`[data-strategy-id="${nextPrompt.id}"]`);
          if (nextCard) {
            nextCard.scrollIntoView({ behavior: 'smooth' });
            // Highlight the card briefly
            nextCard.style.outline = '3px solid var(--ivey-green)';
            setTimeout(() => {
              nextCard.style.outline = '';
            }, 2000);
          }
        }
      }
    });
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
        console.log('Explore button clicked for prompt:', prompt?.title);
        console.log('Card parent:', card.parentElement?.id);
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
    
    // Find the grid container - could be main strategies grid or recent prompts grid
    let grid = card.closest('#strategiesGrid, #recentPromptsGrid');
    
    // If closest() doesn't find it, check if the direct parent is one of our grids
    if (!grid) {
      const parent = card.parentElement;
      if (parent && (parent.id === 'strategiesGrid' || parent.id === 'recentPromptsGrid')) {
        grid = parent;
      }
    }
    
    console.log('Grid found:', grid?.id);
    if (!grid) {
      // Final fallback to main grid
      grid = document.getElementById('strategiesGrid');
      console.log('Using fallback grid:', grid?.id);
    }
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
    const isCurrentlyExpanded = isCurrentlyFull || isCurrentlyDetails;
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
        // If we were already in full-screen mode (from chat), maintain full-screen for details
        if (isCurrentlyFull) {
          grid.classList.add('expanded');      // keep siblings dimmed
          card.classList.add('expanded-full'); // maintain full-screen
        } else {
          // in-flow wide card; no grid dimming
          card.classList.add('expanded-details');
        }
        console.log('Added details mode classes');
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
          <button class="btn export-chat-btn" data-export="true">📥 Export Chat</button>
          <button class="btn details-btn" data-switch="details">View Example</button>
          <button class="close-expanded btn-ghost" aria-label="Close">← Back</button>
        </div>
      </div>
      <div class="chat-body">
        <div class="prompt-blurb">
          <strong>Selected Prompt:</strong>
          <p class="card-description" style="margin:.25rem 0 0 0">${title}</p>
        </div>
        <div class="file-upload-area" id="fileUploadArea" style="display:none;">
          <div class="upload-dropzone" id="uploadDropzone">
            <div class="upload-icon">📁</div>
            <div class="upload-text">
              <strong>Drop files here or click to browse</strong>
              <div class="upload-subtext">PDF, PowerPoint, Word, or image files (max 50MB)</div>
            </div>
            <input type="file" id="fileInput" accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.jpg,.jpeg,.png" style="display:none;">
          </div>
          <div class="uploaded-file" id="uploadedFile" style="display:none;">
            <div class="file-info">
              <span class="file-name" id="fileName"></span>
              <span class="file-size" id="fileSize"></span>
            </div>
            <button class="remove-file-btn" id="removeFileBtn">✕</button>
          </div>
        </div>
        <div class="input-group">
          <button class="btn upload-toggle-btn" id="uploadToggleBtn">📎 Upload File</button>
          <input type="text" id="chatInput" placeholder="Type your message..." class="chat-input" disabled>
          <button id="sendMessage" class="btn btn-primary" disabled>Send</button>
        </div>
        <div class="follow-up-suggestions" id="followUpSuggestions" style="display:none;">
          <h4 style="margin:1rem 0 .5rem 0; color:var(--ivey-green); font-weight:700;">💡 Suggested Next Steps</h4>
          <div class="suggestions-list" id="suggestionsList"></div>
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

    chatArea.querySelector('[data-export="true"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.exportChatConversation(chatArea, prompt);
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
      this.addToRecentPrompts(this.currentPrompt); // Track usage when switching to chat
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
      const uploadedFile = chatArea.uploadedFile;
      
      if (message || uploadedFile) {
        // Show user message
        let displayMessage = message;
        if (uploadedFile) {
          displayMessage = message ? `${message} [📎 ${uploadedFile.name}]` : `[📎 ${uploadedFile.name}]`;
        }
        
        this.addMessage(messagesContainer, 'user', displayMessage);
        chatInput.value = '';
        this.handleUserMessage(messagesContainer, message, uploadedFile);
        
        // Clear uploaded file after sending
        if (uploadedFile) {
          this.clearUploadedFile(chatArea);
        }
      }
    };

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // File upload functionality
    this.initializeFileUpload(chatArea);
  }

  initializeFileUpload(chatArea) {
    const uploadToggleBtn = chatArea.querySelector('#uploadToggleBtn');
    const fileUploadArea = chatArea.querySelector('#fileUploadArea');
    const uploadDropzone = chatArea.querySelector('#uploadDropzone');
    const fileInput = chatArea.querySelector('#fileInput');
    const uploadedFile = chatArea.querySelector('#uploadedFile');
    const removeFileBtn = chatArea.querySelector('#removeFileBtn');

    let currentFile = null;

    // Toggle upload area
    uploadToggleBtn?.addEventListener('click', () => {
      const isVisible = fileUploadArea.style.display !== 'none';
      fileUploadArea.style.display = isVisible ? 'none' : 'block';
      uploadToggleBtn.textContent = isVisible ? '📎 Upload File' : '✕ Hide Upload';
    });

    // Click to browse
    uploadDropzone?.addEventListener('click', () => {
      fileInput?.click();
    });

    // Drag and drop
    uploadDropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('dragover');
    });

    uploadDropzone?.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelection(files[0], chatArea);
      }
    });

    // File input change
    fileInput?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelection(e.target.files[0], chatArea);
      }
    });

    // Remove file
    removeFileBtn?.addEventListener('click', () => {
      this.clearUploadedFile(chatArea);
    });
  }

  handleFileSelection(file, chatArea) {
    const uploadDropzone = chatArea.querySelector('#uploadDropzone');
    const uploadedFile = chatArea.querySelector('#uploadedFile');
    const fileName = chatArea.querySelector('#fileName');
    const fileSize = chatArea.querySelector('#fileSize');

    // Update UI
    fileName.textContent = file.name;
    fileSize.textContent = this.formatFileSize(file.size);
    
    uploadDropzone.style.display = 'none';
    uploadedFile.style.display = 'flex';

    // Store file reference
    chatArea.uploadedFile = file;
  }

  clearUploadedFile(chatArea) {
    const uploadDropzone = chatArea.querySelector('#uploadDropzone');
    const uploadedFile = chatArea.querySelector('#uploadedFile');
    const fileInput = chatArea.querySelector('#fileInput');

    uploadDropzone.style.display = 'block';
    uploadedFile.style.display = 'none';
    fileInput.value = '';
    chatArea.uploadedFile = null;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatMarkdown(text) {
    // Simple markdown processor for AI messages
    let formatted = text;

    // Convert **bold** text first
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* text
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Handle numbered lists within sentences (like "1) item" or "1. item")  
    formatted = formatted.replace(/(\d+)[\.\)]\s+([^0-9]+?)(?=\s+\d+[\.\)]|\s*$)/g, '<li>$2</li>');
    
    // Handle traditional numbered lists at start of lines
    formatted = formatted.replace(/^(\d+)[\.\)]\s+(.+)$/gm, '<li>$2</li>');
    
    // Handle bullet points (- item, * item)
    formatted = formatted.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');

    // Wrap consecutive list items in <ol> or <ul> tags
    if (formatted.includes('<li>')) {
      // Check if we have numbered items (originally started with digits)
      const hasNumberedItems = /\d+[\.\)]\s+/.test(text);
      const listTag = hasNumberedItems ? 'ol' : 'ul';
      
      formatted = formatted.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gs, (match) => {
        return `<${listTag}>${match}</${listTag}>`;
      });
    }

    // Convert double line breaks to paragraph breaks, but preserve lists
    if (!formatted.includes('<li>')) {
      formatted = formatted.replace(/\n\n/g, '</p><p>');
      // Convert single line breaks to <br> only if not in a list
      formatted = formatted.replace(/\n/g, '<br>');
      
      // Wrap in paragraph tags if not already wrapped and not a list
      if (!formatted.includes('<p>') && !formatted.includes('<ol>') && !formatted.includes('<ul>')) {
        formatted = '<p>' + formatted + '</p>';
      }
    } else {
      // For content with lists, be more careful about paragraph handling
      const parts = formatted.split(/(<[ou]l>.*?<\/[ou]l>)/gs);
      formatted = parts.map(part => {
        if (part.includes('<ol>') || part.includes('<ul>')) {
          return part; // Keep lists as-is
        } else if (part.trim()) {
          // Wrap non-list content in paragraphs
          return '<p>' + part.trim().replace(/\n/g, '<br>') + '</p>';
        }
        return part;
      }).join('');
    }

    return formatted;
  }

  addMessage(container, sender, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Format AI messages with markdown processing
    const formattedContent = sender === 'ai' ? this.formatMarkdown(content) : content;
    
    messageDiv.innerHTML = `<div class="message-content">${formattedContent}</div>`;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }

  async handleUserMessage(container, message, uploadedFile = null) {
    // Show typing indicator
    this.addMessage(container, 'ai', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
    
    // If there's a file, upload it first
    let fileAnalysis = '';
    if (uploadedFile) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileAnalysis = uploadData.message || '';
        } else {
          fileAnalysis = 'Failed to upload file. ';
        }
      } catch (error) {
        console.error('File upload error:', error);
        fileAnalysis = 'Error uploading file. ';
      }
    }
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Remove typing indicator
    const messages = container.querySelectorAll('.message');
    if (messages.length > 0) {
      container.removeChild(messages[messages.length - 1]);
    }
    
    // Generate contextual AI response (including file analysis if present)
    const contextMessage = fileAnalysis ? `${fileAnalysis} User message: ${message}` : message;
    const response = await this.generateContextualResponse(contextMessage);
    this.addMessage(container, 'ai', response);

    // Check if we should show follow-up suggestions
    const messageCount = container.querySelectorAll('.message').length;
    if (messageCount >= 4 && !container.closest('.chat-area').querySelector('.follow-up-suggestions[data-loaded="true"]')) {
      this.generateFollowUpSuggestions(container.closest('.chat-area'));
    }
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

  exportChatConversation(chatArea, prompt) {
    const messagesContainer = chatArea.querySelector('.chat-messages');
    if (!messagesContainer) {
      alert('No conversation to export yet. Start chatting first!');
      return;
    }

    const messages = messagesContainer.querySelectorAll('.message');
    if (messages.length === 0) {
      alert('No messages to export yet.');
      return;
    }

    // Create formatted conversation text
    const timestamp = new Date().toLocaleString();
    const promptTitle = prompt?.title || 'Educational Prompt';
    const promptAuthor = prompt?.author || '';
    
    let exportText = `Educational Prompts Hub - Conversation Export\n`;
    exportText += `Generated: ${timestamp}\n`;
    exportText += `Prompt: ${promptTitle}\n`;
    if (promptAuthor) exportText += `Author: ${promptAuthor}\n`;
    exportText += `\n${'='.repeat(60)}\n\n`;

    messages.forEach((message, index) => {
      const isUser = message.classList.contains('user-message');
      const content = message.querySelector('.message-content');
      
      if (content && !content.querySelector('.typing-indicator')) {
        const sender = isUser ? 'You' : 'AI Assistant';
        const text = content.textContent.trim();
        exportText += `${sender}:\n${text}\n\n`;
      }
    });

    exportText += `${'='.repeat(60)}\n`;
    exportText += `Exported from Educational Prompts Hub\n`;
    exportText += `A curated collection of educational ChatGPT prompts from expert educators`;

    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const filename = `${promptTitle.replace(/[^a-zA-Z0-9]/g, '_')}_conversation_${new Date().toISOString().slice(0, 10)}.txt`;
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success feedback
    const exportBtn = chatArea.querySelector('[data-export="true"]');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = '✅ Exported!';
    exportBtn.style.background = '#10b981';
    
    setTimeout(() => {
      exportBtn.textContent = originalText;
      exportBtn.style.background = '';
    }, 2000);
  }

  async generateFollowUpSuggestions(chatArea) {
    const suggestionsContainer = chatArea.querySelector('#followUpSuggestions');
    const suggestionsList = chatArea.querySelector('#suggestionsList');
    
    if (!suggestionsContainer || !suggestionsList) return;

    try {
      // Analyze the conversation to suggest related prompts
      const messages = chatArea.querySelectorAll('.message .message-content');
      const conversationText = Array.from(messages)
        .map(msg => msg.textContent.trim())
        .filter(text => text && !text.includes('span'))  // Filter out typing indicators
        .slice(-6)  // Last 6 messages for context
        .join(' ');

      const suggestionPrompt = `Based on this educational conversation: "${conversationText}"

From these available educational prompts, suggest the 3 most relevant next steps:

1. "Generate Explanations, Examples, and Analogies" by Lilach Mollick - Generate clear examples and analogies for concepts
2. "Improve Class Slides" by Dan Levy - Get specific advice to improve presentations  
3. "Generate Engaging In-Class Activities" by Kimberly Acquaviva - Create interactive classroom activities
4. "Design Assessment Questions" by Dan Levy - Create exit ticket questions and assessments
5. "Diagnostic Quiz Generator" by Harvard Faculty - Create quizzes to assess understanding
6. "Student Learning Template" by Dan Levy - Provide structured learning templates for students
7. "Teaching Assistant" by Educational Experts - General teaching support and guidance
8. "Create Rubrics" by Assessment Experts - Develop grading rubrics for assignments

Respond with exactly 3 suggestions in this format:
SUGGESTION 1: [Prompt Title]|[Author]|[Brief reason why it's relevant]
SUGGESTION 2: [Prompt Title]|[Author]|[Brief reason why it's relevant]  
SUGGESTION 3: [Prompt Title]|[Author]|[Brief reason why it's relevant]`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: suggestionPrompt,
          prompt: 'You are an educational AI that suggests relevant follow-up prompts based on conversations.'
        })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const suggestions = this.parseSuggestions(data.message);
      
      if (suggestions.length > 0) {
        this.renderSuggestions(suggestionsList, suggestions);
        this.addWorkflowSuggestions(suggestionsList);
        suggestionsContainer.style.display = 'block';
        suggestionsContainer.setAttribute('data-loaded', 'true');
      }

    } catch (error) {
      console.error('Failed to generate follow-up suggestions:', error);
    }
  }

  parseSuggestions(aiResponse) {
    const suggestions = [];
    const lines = aiResponse.split('\n').filter(line => line.includes('SUGGESTION'));
    
    lines.forEach(line => {
      const parts = line.split('|');
      if (parts.length >= 3) {
        const title = parts[0].replace(/SUGGESTION \d+:\s*/, '').trim();
        const author = parts[1].trim();
        const reason = parts[2].trim();
        
        // Find the actual prompt from our data
        const matchingPrompt = this.prompts.find(p => 
          p.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(p.title.toLowerCase())
        );
        
        if (matchingPrompt) {
          suggestions.push({
            ...matchingPrompt,
            reason: reason
          });
        }
      }
    });
    
    return suggestions.slice(0, 3);
  }

  renderSuggestions(container, suggestions) {
    container.innerHTML = '';
    
    suggestions.forEach(suggestion => {
      const card = document.createElement('div');
      card.className = 'suggestion-card';
      card.innerHTML = `
        <div>
          <div class="suggestion-title">${suggestion.title}</div>
          <div class="suggestion-author">by ${suggestion.author}</div>
        </div>
        <div class="suggestion-arrow">→</div>
      `;
      
      card.addEventListener('click', () => {
        // Add to recent prompts and switch to the suggested prompt
        this.addToRecentPrompts(suggestion);
        
        // Find the original card for this prompt
        const originalCard = document.querySelector(`[data-strategy-id="${suggestion.id}"]`);
        if (originalCard) {
          // Close current chat and open new one
          const currentCard = container.closest('.strategy-card');
          this.closeExpandedCard(currentCard);
          
          // Small delay to allow close animation, then open new prompt
          setTimeout(() => {
            this.expandCard(originalCard, suggestion, 'chat');
          }, 300);
        }
      });
      
      container.appendChild(card);
    });
  }

  addWorkflowSuggestions(container) {
    // Add separator
    const separator = document.createElement('div');
    separator.style.cssText = 'margin: 1rem 0; border-top: 1px solid var(--brand-border); padding-top: 1rem;';
    separator.innerHTML = '<h5 style="margin: 0 0 0.5rem 0; color: var(--ivey-purple); font-weight: 600;">🔗 Or start a complete workflow:</h5>';
    container.appendChild(separator);

    // Add workflow suggestions
    Object.entries(this.promptChains).forEach(([key, chain]) => {
      const card = document.createElement('div');
      card.className = 'suggestion-card workflow-suggestion';
      card.style.cssText = 'border-left: 3px solid var(--ivey-purple);';
      card.innerHTML = `
        <div>
          <div class="suggestion-title">${chain.name}</div>
          <div class="suggestion-author">${chain.description}</div>
        </div>
        <div class="suggestion-arrow">🚀</div>
      `;
      
      card.addEventListener('click', () => {
        // Close current chat and start workflow
        const currentCard = container.closest('.strategy-card');
        this.closeExpandedCard(currentCard);
        
        // Start the workflow
        setTimeout(() => {
          this.startPromptChain(key);
          
          // Navigate to first prompt
          const firstPromptTitle = chain.steps[0];
          const firstPrompt = this.prompts.find(p => p.title === firstPromptTitle);
          if (firstPrompt) {
            const firstCard = document.querySelector(`[data-strategy-id="${firstPrompt.id}"]`);
            if (firstCard) {
              firstCard.scrollIntoView({ behavior: 'smooth' });
              // Auto-click to start the workflow
              setTimeout(() => {
                const exploreBtn = firstCard.querySelector('.explore-btn');
                if (exploreBtn) {
                  exploreBtn.click();
                }
              }, 500);
            }
          }
        }, 300);
      });
      
      container.appendChild(card);
    });
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
