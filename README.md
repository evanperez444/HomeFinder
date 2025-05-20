![image](https://github.com/user-attachments/assets/a83b0d8a-3e74-4dbe-a50f-c65c8ccce474)


# HomeFinder - Real Estate Platform

HomeFinder is a full-stack web application for real estate listings, allowing users to browse properties, filter listings, view details, and request appointments.

## Features

- Property browsing with filtering options
- Google Maps integration for property locations
- Property details with image galleries
- User authentication system
- Property rating system
- Appointment scheduling for property viewings
- AI-powered chatbot for home buying/renting advice

## Technology Stack

- **Frontend**: React, TailwindCSS, shadcn UI components
- **Backend**: Express.js
- **Database**: In-memory storage (for development)
- **Maps**: Google Maps JavaScript API
- **AI Assistant**: Google Gemini API

## Requirements

- Node.js 18+ installed
- Google Maps API key (already configured)
- Google Gemini API key (already configured)

## How to Run the Application

1. **Install dependencies**

```bash
npm install
```

2. **Start the development server**

```bash
npm run dev
```

3. **Access the application**

Open your browser and navigate to:
```
http://localhost:5000
```

## Usage Guide

### Property Browsing
- Use the search filters on the homepage to narrow down properties by price, bedrooms, etc.
- Click on any property card to view detailed information

### Property Details
- View property specifications, location on Google Maps, and image gallery
- Request a viewing appointment using the appointment form
- Rate properties using the star rating system

### Account Management
- Register a new account to save favorite properties and request viewings
- Login to access your saved properties and manage appointments

### AI Assistant
- Access the chatbot by clicking on the "Real Estate Assistant" in the navigation
- Ask questions about home buying, mortgages, or rental advice

## API Keys

This application uses the following API keys:

- Google Maps API: Already configured
- Google Gemini AI: Already configured

## Development Notes

- The application uses in-memory storage for development purposes
- Property data is seeded on application startup
