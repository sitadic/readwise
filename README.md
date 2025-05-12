Readwise: Social Book Review Platform
Overview
Readwise is a Next.js (React) web application designed as part of the research project "Accelerating Book Recommendations: Real-Time Personalization on Social Review Platforms with FAISS and LDA". The platform enables users to discover, review, and discuss books through real-time, personalized recommendations powered by FAISS and LDA. Key features include user onboarding, book recommendations, thread creation, social interactions (comments, ratings), and a purchase/rental system for books. The frontend integrates with a backend API (e.g., xAI’s API) to fetch recommendations with sub-50ms latency, leveraging social signals (e.g., votes, comments) to enhance engagement.
Features

Real-Time Recommendations: Fetch personalized book suggestions with low latency (<50ms) using FAISS and LDA.
User Onboarding: A multi-step onboarding process (welcome, interests, recommendation, final) to initialize user profiles and preferences.
Social Interactions: Create threads (PostThread), comment (Comment), and rate books (Rating).
Book Discovery: Explore books via search (search), discover page (discover), and detailed views (details/[id]).
User Profiles: View user activity and recommendations (profile/[id], ThreadsTab).
Purchase/Rental System: Rent or buy books (rentals/[id]/[user_id], purchase/[id]/[user_id]).
Responsive Design: Styled with Tailwind CSS, featuring a theme switcher (ThemeSwitcher) and custom fonts (Geist).

Prerequisites

Node.js: Version 18.x or higher
npm: For package management
Backend API: A running instance of the recommendation API (e.g., hosted via xAI's API at https://x.ai/api)
Fonts: Ensure GeistMonoVF.woff and GeistVF.woff are in the app/fonts/ directory

Setup Instructions

Clone the Repository  
git clone https://github.com/your-username/readwise.git
cd readwise


Install Dependencies  
npm install


Environment VariablesCreate a .env.local file in the root directory and add the following:

Run the Development Server  
npm run dev

Open http://localhost:3000 in your browser to view the app.


Usage

Sign Up / Sign In  

Navigate to http://localhost:3000/auth/sign-up or http://localhost:3000/auth/sign-in.
Sign up using the provided authentication flow (e.g., via [[...sign-up]]).


Onboarding  

Complete the onboarding process (/auth/onboarding):
Welcome step (welcome.tsx)
Select interests (interests.tsx)
View initial recommendations (recommendation.tsx)
Finalize profile (final.tsx)




Explore Books  

Use the Discover page (/discover) to browse trending books.
Search for books (/search) using keywords.
View book details (/details/[id]), including metadata (BookMetadataCard), reviews (SampleReviewCard), and comments (Comments).


Interact Socially  

Create a thread about a book (/create-thread) using PostThread.
Comment on threads (/thread/[id]) using Comment.
Rate books using the Rating component.


Manage Profile  

Visit your profile (/profile/[id]) to see your threads (ThreadsTab) and activity.


Purchase or Rent Books  

Rent a book (/rentals/[id]/[user_id]) or purchase it (/purchase/[id]/[user_id]).



Screenshots
Screenshots of the application are available in the ss/ folder:

Homepage: 
Onboarding: 
Book Details: 
Recommendations: 
Profile: 

Project Structure
readwise/
├── app/                     # Next.js app directory (App Router)
│   ├── (auth)/              # Authentication routes
│   │   ├── layout.tsx       # Auth layout
│   │   ├── onboarding/      # Onboarding flow
│   │   ├── sign-in/         # Sign-in route
│   │   └── sign-up/         # Sign-up route
│   ├── (root)/              # Main app routes
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   ├── create-thread/   # Thread creation page
│   │   ├── details/[id]/    # Book details page
│   │   ├── discover/        # Discover books page
│   │   ├── profile/[id]/    # User profile page
│   │   ├── purchase/[id]/[user_id]/  # Purchase page
│   │   ├── rentals/[id]/[user_id]/   # Rental page
│   │   ├── search/          # Search page
│   │   └── thread/[id]/     # Thread details page
│   ├── fonts/               # Custom fonts (Geist)
│   ├── favicon.ico          # Favicon
│   ├── globals.css          # Global styles
│   └── ThemeProvider.tsx    # Theme context provider
├── components/              # Reusable React components
│   ├── Rating.tsx           # Rating component
│   ├── cards/               # Card components (e.g., BookCard, ThreadCards)
│   ├── forms/               # Form components (e.g., Comment, PostThread)
│   ├── onboarding/          # Onboarding components
│   ├── shared/              # Shared components (e.g., LeftSidebar, Topbar)
│   └── ui/                  # UI components (e.g., button, card, input)
├── lib/                     # Utility functions and actions
│   ├── actions/             # Server actions (e.g., thread.actions.ts)
│   ├── validations/         # Validation schemas (e.g., thread.ts)
│   └── utils.ts             # Utility functions
├── public/                  # Static assets (e.g., images)
├── ss/                      # Screenshots folder
│   ├── homepage.png         # Homepage screenshot
│   ├── onboarding.png       # Onboarding screenshot
│   ├── book-details.png     # Book details screenshot
│   ├── recommendations.png  # Recommendations screenshot
│   └── profile.png          # Profile screenshot
├── .env.local               # Environment variables
├── .gitignore               # Git ignore rules
├── components.json          # Component metadata
├── middleware.ts            # Next.js middleware
├── next-env.d.ts            # TypeScript declarations
├── next.config.mjs          # Next.js configuration
├── package-lock.json        # Dependency lock file
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation

Scripts

npm run dev: Start the development server (http://localhost:3000).
npm run build: Build the app for production.
npm run start: Start the production server.

Technologies Used

Next.js: React framework with App Router for server-side rendering and static site generation.
React: For building UI components.
TypeScript: For type-safe development.
Tailwind CSS: For styling, configured in tailwind.config.ts.
CDN Libraries:
React: https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
React DOM: https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js


Fonts: Geist Mono and Geist VF for custom typography.
Axios: For API requests (assumed in utils.ts).

API Integration
The app fetches recommendations via a backend API (NEXT_PUBLIC_API_URL). Example request payload:
{
  "user_id": "user_1",
  "liked_book_ids": ["1001", "1002"],
  "preferred_author_ids": ["author_1"],
  "user_interests": ["science", "fiction"],
  "top_n": 5
}

Example response:
[
  {
    "book_id": "1003",
    "title": "Science Book A",
    "similarity": 0.95
  },
  ...
]

Backend Note
Note: This GitHub repository currently contains only the frontend code for Readwise. The backend, implemented using Flask, is not included in this repository but will be added later in a separate repository or folder. The Flask backend handles the FAISS and LDA-based recommendation logic, user authentication, and database interactions.
Deployment

Build the App  
npm run build




License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or feedback, reach out to oneAlive.
