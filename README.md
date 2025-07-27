# AI Web App Generator

A powerful Next.js application that generates complete full-stack web applications using the V0.dev API. Simply describe your application, and get a production-ready Next.js project with frontend components, API routes, and all necessary configurations.

## Features

- **AI-Powered Generation**: Uses V0.dev API to generate complete applications
- **Full-Stack Output**: Generates both frontend and backend code
- **TypeScript Support**: All generated code includes proper TypeScript types
- **TailwindCSS Styling**: Modern, responsive design with TailwindCSS
- **Complete Project Structure**: Includes all necessary configuration files
- **Download Ready**: Get a complete ZIP file ready to run locally

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- V0.dev API key

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd llm-web-app-generator
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
V0_API_KEY=your_v0_api_key_here
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Describe Your Application**: Enter a detailed description of the web application you want to generate
2. **Generate Code**: Click "Generate Full-Stack App" to create your application
3. **Review Code**: Browse through the generated frontend and API code
4. **Download Project**: Download the complete project as a ZIP file
5. **Run Locally**: Extract the ZIP and run `npm install && npm run dev`

## Example Prompts

For best results, be specific about the functionality you want:

- **"Create a todo app with add, delete, and mark as complete functionality"**
- **"Build a blog with posts, comments, and user authentication"**
- **"Make an e-commerce site with product catalog, shopping cart, and checkout"**
- **"Design a dashboard with charts, user management, and real-time updates"**
- **"Create a social media platform with posts, likes, and user profiles"**

## Generated Project Structure

The generated projects include:

```
generated-app/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout component
│   ├── globals.css       # Global styles
│   └── api/              # API routes
│       └── */route.ts    # Backend endpoints
├── components/           # Reusable React components
├── lib/                  # Utility functions
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration
└── README.md            # Project documentation
```

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **AI Generation**: V0.dev API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
