# Bob - Whisky Recommendation AI Agent

Bob is an AI-powered whisky recommendation system that analyzes users' virtual bars within the BAXUS ecosystem to provide personalized bottle recommendations.

## Features

- **Collection Analysis**: Analyzes your existing whisky collection to understand your preferences
- **Personalized Recommendations**: Suggests new bottles based on your taste profile
- **AI-Powered Matching**: Uses semantic embeddings to find similar bottles
- **Interactive Chat Interface**: Ask questions and get recommendations through natural conversation
- **Detailed Bottle Information**: Get comprehensive details about recommended bottles

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/starc007/whiskey-agent.git
cd whiskey-agent
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google API key:

```
GOOGLE_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technical Stack

- **Frontend**: Next.js 15 with App Router
- **AI Integration**: Google Generative AI for embeddings
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Animation**: Framer Motion
