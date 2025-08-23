# Educational Prompts Hub

A web application for exploring and trying educational ChatGPT prompts with integrated AI chat. Browse through curated prompts from expert educators and chat directly with Claude AI using proven educational strategies.

## Features

- **Educational Prompt Library**: Explore 20+ educational prompts from Harvard, UPenn, and other top institutions
- **Full-Screen Chat Interface**: Immersive chat experience that takes over the entire screen
- **Card Expansion System**: Smooth animations with View Transitions API and FLIP fallback
- **Real-time AI Integration**: Direct chat with Claude AI using curated educational prompts
- **Responsive Design**: Professional Ivey-themed interface optimized for educators
- **Prompt Categories**: Curriculum Design, Teaching Methods, Assessment, and more

## Installation

### Standard Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your Claude API key:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and add your Claude API key:
   ```
   CLAUDE_API_KEY=your_api_key_here
   ```

### Docker Installation (Recommended)

1. Clone this repository
2. Create `.env` file with your Claude API key:
   ```
   CLAUDE_API_KEY=your_api_key_here
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up
   ```

## Usage

### Standard Usage

1. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Docker Usage

1. Development mode:
   ```bash
   docker-compose up
   ```

2. Production mode:
   ```bash
   docker-compose --profile production up
   ```

3. Open your browser and navigate to `http://localhost:3000`

### How to Use

1. Browse educational prompts in the card grid
2. Click "Try This Prompt" for full-screen AI chat experience
3. Click "View Details" to see prompt information and metadata
4. Chat directly with Claude AI using the selected educational prompt

## API Endpoints

- `GET /` - Serve the main application
- `POST /api/chat` - Chat with Claude AI using educational prompts

## Docker Benefits

- **Consistent Environment**: Same Node.js version and dependencies everywhere
- **Easy Deployment**: Works on any platform that supports Docker
- **Development Isolation**: No need to install Node.js locally
- **Production Ready**: Optimized with health checks and security best practices
- **Scalable**: Ready for container orchestration (Kubernetes, Docker Swarm)

## Prompt Categories

- **Curriculum Design**: Lesson planning, learning objectives, course structure
- **Teaching Methods**: Active learning, differentiation, collaborative techniques
- **Assessment**: Diagnostic quizzes, formative evaluation, rubric creation
- **Student Engagement**: Motivation techniques, interactive activities
- **Educational Technology**: Digital tool integration, online learning
- **Professional Development**: Coaching, reflection, skill building

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript with View Transitions API
- **Backend**: Node.js, Express.js
- **AI Integration**: Anthropic Claude API (Haiku model)
- **Styling**: Custom CSS with Ivey branding and responsive design
- **Containerization**: Docker and Docker Compose
- **Animations**: FLIP technique with CSS transforms

## Development

The application uses a modern, scalable architecture:

- `index.html` - Main application interface with card templates
- `styles.css` - Complete Ivey-themed styling with expansion animations
- `app.js` - Frontend JavaScript with full-screen card expansion system
- `strategies-data.js` - Educational prompts database from expert educators
- `server.js` - Express server with Claude API integration
- `Dockerfile` - Container configuration with security best practices
- `docker-compose.yml` - Local development and production environments

## Deployment

### Render (with Docker)
1. Connect your GitHub repository to Render
2. Select "Docker" as the environment
3. Add `CLAUDE_API_KEY` environment variable
4. Deploy automatically from Docker container

### Traditional Render
1. Set build command: `npm install`
2. Set start command: `npm start`
3. Add `CLAUDE_API_KEY` environment variable

## Contributing

This educational tool helps teachers try proven ChatGPT prompts with AI assistance. Feel free to:

- Add new educational prompts to `strategies-data.js`
- Enhance the chat interface and user experience
- Improve card expansion animations and interactions
- Add new features like prompt favorites or sharing

## License

MIT License - feel free to use this for educational purposes.