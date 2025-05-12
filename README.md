
# 📚 Readwise: Social Book Review Platform

Readwise is a **Next.js (React)** web application developed as part of the research project:

> _"Accelerating Book Recommendations: Real-Time Personalization on Social Review Platforms with FAISS and LDA"_

It enables users to discover, review, and discuss books through real-time, personalized recommendations powered by **FAISS** and **LDA**.

---

## 🚀 Features

- ⚡ **Real-Time Recommendations**: Sub-50ms latency using FAISS and topic modeling (LDA).
- 🧭 **User Onboarding**: Multi-step flow to initialize reading preferences.
- 💬 **Social Interactions**: Thread creation, comments, and ratings on books.
- 🔍 **Book Discovery**: Search, trending books, metadata, and reviews.
- 👤 **User Profiles**: View personal threads and recommendation history.
- 💳 **Purchase / Rental System**: Rent or buy books directly within the app.
- 🌙 **Responsive UI**: Built with Tailwind CSS, dark/light theme switcher, and Geist fonts.

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: For dependency management
- **Backend API**: e.g., `https://x.ai/api`
- **Fonts**: `GeistMonoVF.woff` and `GeistVF.woff` should be placed in `app/fonts/`

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/one-Alive/readwise.git
cd readwise
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory for clerk api

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Usage

### 🔐 Authentication

* `/auth/sign-up`
* `/auth/sign-in`

### 🧭 Onboarding (`/auth/onboarding`)

1. `welcome.tsx` – Welcome screen
2. `interests.tsx` – Select interests
3. `recommendation.tsx` – Preview personalized recommendations
4. `final.tsx` – Finalize and save preferences

### 📚 Book Discovery

* Trending: `/discover`
* Search: `/search`
* Book Details: `/details/[id]`

  * Includes: `BookMetadataCard`, `SampleReviewCard`, and `Comments`

### 💬 Community

* Create threads: `/create-thread`
* View threads and engage: `/thread/[id]`
* Rate books using the `Rating` component

### 👤 Profiles

* View user activity: `/profile/[id]`
* Explore personal threads via `ThreadsTab`

### 💸 Buy or Rent Books

* Rent: `/rentals/[id]/[user_id]`
* Buy: `/purchase/[id]/[user_id]`

---

## 🖼️ Screenshots

Located in the `ss/` folder:

* `homepage.png`
* `onboarding.png`
* `book-details.png`
* `recommendations.png`
* `profile.png`

---

## 📁 Project Structure

```
readwise/
├── app/
│   ├── (auth)/
│   │   ├── onboarding/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/
│   │   ├── create-thread/
│   │   ├── details/[id]/
│   │   ├── discover/
│   │   ├── profile/[id]/
│   │   ├── purchase/[id]/[user_id]/
│   │   ├── rentals/[id]/[user_id]/
│   │   ├── search/
│   │   └── thread/[id]/
│   ├── fonts/
│   └── ThemeProvider.tsx
├── components/
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
├── .env.local
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 📦 Scripts

* `npm run dev` – Start development server
* `npm run build` – Build for production
* `npm run start` – Launch production build

---

## 🧰 Technologies

* **Next.js** – App Router, SSR, SSG
* **React + TypeScript** – Component-driven development
* **Tailwind CSS** – Utility-first styling
* **Axios** – For API communication
* **Geist Fonts** – Custom font system

#### CDN Fallbacks

* React: `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js`
* ReactDOM: `https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js`

---

## 🌐 API Integration

**Endpoint:** 

**Example Request:**

```json
{
  "user_id": "user_1",
  "liked_book_ids": ["1001", "1002"],
  "preferred_author_ids": ["author_1"],
  "user_interests": ["science", "fiction"],
  "top_n": 5
}
```

**Example Response:**

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

## ⚠️ Note on Backend

> This repository contains **only the frontend**.
> The **Flask-based backend**, including FAISS, LDA, and recommendation logic, will be released separately.

---

## 🚀 Deployment

```bash
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

Questions or feedback?
Reach out to **@oneAlive** or open an issue.
