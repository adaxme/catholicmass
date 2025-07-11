# Daily Mass Companion

A beautiful Catholic web application that provides daily Mass readings, Saint of the Day, and AI-generated homilies with multi-language support.

## Features

- 📖 **Daily Catholic Mass Readings** - Automatically fetches readings from Universalis API
- 👼 **Saint of the Day** - Display name, feast description, and biography
- 🧠 **AI-Generated Homilies** - Uses Google Gemini Pro to create thoughtful spiritual reflections
- 🌐 **Multi-Language Support** - Translate content to 6 languages (English, Spanish, French, Latin, Portuguese, German)
- 📱 **Responsive Design** - Beautiful interface that works on all devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Gemini API

The app is pre-configured with a Gemini API key and ready to use. The AI features include:

- **AI-Generated Homilies**: Creates homilies that are 50% theological reflection and 50% practical application
- **AI Saint Research**: Uses internet search capabilities to find accurate saint information for each day
- **Real-time Translation**: Translates content between 6 languages with theological accuracy
### 3. Start Development Server

```bash
npm run dev
```

## API Integration

### Readings API
- Uses Universalis.com JSONP API for daily Mass readings
- Automatically fetches First Reading, Psalm, Second Reading (when available), Gospel Acclamation, and Gospel

### Google Gemini Pro
- Generates contextual homilies based on daily readings
- Provides real-time translation between supported languages
- Creates thoughtful spiritual reflections with practical applications

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Google Generative AI** (@google/generative-ai) for AI features
- **Vite** for development and building

## Project Structure

```
src/
├── components/          # React components
├── services/           # API services (Gemini integration)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

## Contributing

This is a Catholic spiritual resource application. Contributions should maintain the reverent and respectful nature of the content while improving functionality and user experience.

## License

This project is created for the Catholic community with love and devotion.