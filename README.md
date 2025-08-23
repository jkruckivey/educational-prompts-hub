# Educational Strategies Hub

A web application for exploring and refining educational strategies with AI assistance. Browse through curated teaching strategies, filter by category and difficulty, and get personalized AI guidance for implementation.

## Features

- **Strategy Browsing**: Explore 10+ educational strategies with detailed descriptions
- **Smart Filtering**: Filter by category (Curriculum Design, Teaching Methods, Assessment, etc.) and difficulty level
- **AI-Powered Guidance**: Get personalized implementation advice using Claude AI
- **Interactive Interface**: Clean, responsive design optimized for educators
- **Real-time Search**: Find strategies quickly with live search functionality

## Installation

1. Clone or download this repository
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

## Usage

1. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Browse strategies, use filters to find what you need, and click "Explore with AI" for personalized guidance

## API Endpoints

- `GET /` - Serve the main application
- `GET /api/strategies` - Get all available strategies
- `POST /api/generate-guidance` - Generate AI-powered teaching guidance
- `GET /api/health` - Health check endpoint

## Strategy Categories

- **Curriculum Design**: Lesson planning, learning objectives
- **Teaching Methods**: Differentiation, collaboration, project-based learning
- **Assessment**: Formative and summative evaluation techniques
- **Management**: Classroom organization and behavior strategies
- **Technology**: EdTech integration and digital tools
- **Engagement**: Student motivation and participation techniques
- **Cognitive Skills**: Critical thinking and higher-order learning
- **Equity & Inclusion**: Culturally responsive teaching practices

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI Integration**: Anthropic Claude API (Haiku model)
- **Styling**: Custom CSS with responsive design

## Development

The application uses a simple, clean architecture:

- `index.html` - Main application interface
- `styles.css` - Complete styling and responsive design
- `app.js` - Frontend JavaScript for interactivity
- `strategies-data.js` - Educational strategies database
- `server.js` - Express server with Claude API integration
- `package.json` - Dependencies and scripts

## Contributing

This is an educational tool designed to help teachers implement effective strategies. Feel free to:

- Add new educational strategies to `strategies-data.js`
- Enhance the AI prompts for better guidance
- Improve the user interface and experience
- Add new features like strategy favorites or sharing

## License

MIT License - feel free to use this for educational purposes.