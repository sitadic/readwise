
# Readwise: Social Book Review Platform

## Overview

**Readwise** is a **Next.js (React)** web application designed as part of the research project:

> *"Accelerating Book Recommendations: Real-Time Personalization on Social Review Platforms with FAISS and LDA"*

The platform enables users to discover, review, and discuss books through real-time, personalized recommendations powered by **FAISS** and **LDA**.

Key features include:
- User onboarding
- Book recommendations
- Thread creation
- Social interactions (comments, ratings)
- Purchase/rental system for books

The frontend integrates with a backend API (e.g., xAI’s API) to fetch recommendations with **sub-50ms latency**, leveraging social signals (e.g., votes, comments) to enhance engagement.

---

## Features

- 🚀 **Real-Time Recommendations**: Fetch personalized book suggestions in under 50ms using FAISS and LDA.
- 🧭 **User Onboarding**: Multi-step onboarding process to initialize user preferences.
- 💬 **Social Interactions**: Create threads, comment, and rate books.
- 📚 **Book Discovery**: Search, explore trending books, and view detailed metadata and reviews.
- 👤 **User Profiles**: Show user activity and personalized recommendations.
- 💳 **Purchase/Rental System**: Rent or buy books directly within the app.
- 🌗 **Responsive Design**: Built with Tailwind CSS, with theme switcher and custom fonts (Geist).

---

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: For managing packages
- **Backend API**: A running instance (e.g., https://x.ai/api)
- **Fonts**: Ensure `GeistMonoVF.woff` and `GeistVF.woff` are in `app/fonts/`

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/one-Alive/readwise.git
cd readwise
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add clerk api

### 4. Run the Development Server

```bash
npm run dev
```

Then open your browser and go to:
👉 [http://localhost:3000](http://localhost:3000)

---

## Usage

### 🔐 Sign Up / Sign In

Navigate to:

* `/auth/sign-up`
* `/auth/sign-in`

Use the provided authentication flow.

### 🚀 Onboarding

Complete onboarding at `/auth/onboarding`:

1. `welcome.tsx` – Welcome screen
2. `interests.tsx` – Select interests
3. `recommendation.tsx` – View recommendations
4. `final.tsx` – Finalize profile

### 📖 Explore Books

* Browse trending books: `/discover`
* Search for books: `/search`
* View details: `/details/[id]`
  Includes:

  * `BookMetadataCard`
  * `SampleReviewCard`
  * `Comments`

### 💬 Interact Socially

* Create threads: `/create-thread`
* Comment on threads: `/thread/[id]`
* Rate books using the `Rating` component

### 👤 Manage Profile

* View user profile: `/profile/[id]`
* See user threads: `ThreadsTab`

### 💰 Purchase or Rent Books

* Rent: `/rentals/[id]/[user_id]`
* Buy: `/purchase/[id]/[user_id]`

---

## Screenshots

Screenshots available in the `ss/` folder:

* `homepage.png` – Homepage
* `onboarding.png` – Onboarding
* `book-details.png` – Book details
* `recommendations.png` – Recommendations
* `profile.png` – Profile

---

## Project Structure

```
readwise/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── onboarding/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── create-thread/
│   │   ├── details/[id]/
│   │   ├── discover/
│   │   ├── profile/[id]/
│   │   ├── purchase/[id]/[user_id]/
│   │   ├── rentals/[id]/[user_id]/
│   │   ├── search/
│   │   └── thread/[id]/
│   ├── fonts/
│   ├── favicon.ico
│   ├── globals.css
│   └── ThemeProvider.tsx
├── components/
│   ├── Rating.tsx
│   ├── cards/
│   ├── forms/
│   ├── onboarding/
│   ├── shared/
│   └── ui/
├── lib/
│   ├── actions/
│   ├── validations/
│   └── utils.ts
├── public/
├── ss/
│   ├── homepage.png
│   ├── onboarding.png
│   ├── book-details.png
│   ├── recommendations.png
│   └── profile.png
├── .env.local
├── .gitignore
├── components.json
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Scripts

* `npm run dev` – Start development server
* `npm run build` – Build for production
* `npm run start` – Start production server

---

## Technologies Used

* **Next.js** – App Router, SSR, SSG
* **React** – UI Components
* **TypeScript** – Type-safe development
* **Tailwind CSS** – Utility-first styling
* **Axios** – For API requests
* **Geist Fonts** – Custom typography

### CDN Libraries

* React:
  `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js`
* ReactDOM:
  `https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js`

---

## API Integration

**Endpoint:** `${NEXT_PUBLIC_API_URL}`
**Example request payload:**

```json
{
  "user_id": "user_1",
  "liked_book_ids": ["1001", "1002"],
  "preferred_author_ids": ["author_1"],
  "user_interests": ["science", "fiction"],
  "top_n": 5
}
```

**Example response:**

```json
[
  {
    "book_id": "1003",
    "title": "Science Book A",
    "similarity": 0.95
  }
]
```

---

## Backend Note

> This repository contains **only the frontend** of Readwise.
> The **Flask-based backend**, handling FAISS/LDA recommendations and user data, will be released separately.

---

## Deployment

To build the app for production:

```bash
npm run build
```

---

## License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full details.

---

## Contact

Questions or feedback?
Reach out to **oneAlive**.

```

---

Would you like help generating the LICENSE file or backend README as well?
```
