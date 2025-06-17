# 🧩 Collaborative Task Manager

A full-featured, modern task management web application built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Radix UI**. This project was developed as part of a React/Next.js interview task to showcase clean architecture, efficient state management, form validation, and data fetching.

---

## 🚀 Features

### 📌 Task Management
- ✅ Create, read, update, delete tasks
- 📋 View tasks by status: `To Do`, `In Progress`, `Done`
- 🏷️ Set task priority: `Low`, `Medium`, `High`
- 🗓️ Due dates and assignees
- 📤 Drag-and-drop tasks between columns *(Bonus)*
- 🔍 Filter tasks by status and priority
- 🧮 Sort tasks by due date or priority *(Optional)*

### 📚 Recipe Explorer *(Bonus)*
- Fetch recipes from [TheMealDB API](https://themealdb.com/api.php)
- Search by name
- Display in table format
- Caching with TanStack Query

---

## 🧰 Tech Stack

| Area               | Tech                                      |
|--------------------|-------------------------------------------|
| Framework          | [Next.js](https://nextjs.org) (App Router) |
| Language           | TypeScript                                |
| Styling            | Tailwind CSS, `tailwindcss-animate`       |
| State Management   | Zustand                                   |
| Form Handling      | React Hook Form                           |
| Validation         | Zod                                       |
| Data Fetching      | TanStack React Query                      |
| UI Components      | Radix UI, Shadcn UI, Lucide React         |
| Utilities          | clsx, immer, date-fns                     |
| Charts/Carousel    | Recharts, Embla Carousel                  |

---

## 📁 Folder Structure

```
.
├── app/
│   ├── recipes/              # Recipe page
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main Task Board
│   └── providers.tsx         # Global providers
│
├── components/               # UI components
├── hooks/                    # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/                      # Shared logic
│   ├── schemas.ts            # Zod schemas
│   ├── store.ts              # Zustand store
│   ├── types.ts              # TS types
│   └── utils.ts              # Helpers
│
├── public/                   # Static assets (placeholders)
├── styles/                   # Extra styles (if any)
├── tailwind.config.ts        # TailwindCSS config
├── postcss.config.mjs        # PostCSS config
├── next.config.mjs           # Next.js config
├── tsconfig.json             # TypeScript config
├── package.json              # Project metadata and dependencies
└── README.md
```

---

## 🧪 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/collaborative-task-manager.git
cd collaborative-task-manager
```

### 2. Install dependencies
```bash
yarn install
# or
npm install
```

### 3. Start the development server
```bash
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action.

---

## 📦 Scripts

| Command         | Description                           |
|----------------|---------------------------------------|
| `dev`           | Start local dev server                |
| `build`         | Build project for production          |
| `start`         | Start production server               |
| `lint`          | Run ESLint checks                     |

---

## 🔐 Environment Variables

This app currently does not require `.env` configuration for its demo APIs. If future APIs are added, you may include a `.env.example` file for configuration.

---

## 🌐 Bonus API Integration

**API:** [TheMealDB](https://themealdb.com/api.php)

**Endpoint Example:**
```bash
https://themealdb.com/api/json/v1/1/search.php?s=pasta
```

---

## ✅ Future Enhancements

- [ ] Confirmation dialogs on delete
- [ ] Task title search
- [ ] Authentication & user-specific task filtering
- [ ] Backend integration (e.g., Prisma + PostgreSQL)
- [ ] Responsive drag-and-drop support

---

## 📝 License

MIT License

---

## 👤 Author

Built with 💙 by [Your Name](https://github.com/your-username) as part of a technical interview task.