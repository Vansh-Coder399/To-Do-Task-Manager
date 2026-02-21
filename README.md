# 🚀 To-Do Task Manager

A **futuristic, space-themed** task manager built with React and CSS 3D transforms. Manage your tasks in a stunning animated space environment — no WebGL required!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)

---

## ✨ Features

- 🌌 **Animated space background** — Canvas 2D twinkling, drifting stars
- 🃏 **3D floating cards** — CSS `perspective` + mouse-tracking tilt effect
- 🎬 **Smooth animations** — Cards fly in on add, shrink on delete
- ✅ **Complete / Undo** — Toggle task completion with visual feedback
- 🗂️ **3 Categories** — Work (blue), Personal (purple), Urgent (red)
- ⚡ **3 Priority levels** — High (red), Medium (amber), Low (green)
- 📊 **Progress ring** — Animated SVG ring tracking completion %
- 💎 **Glassmorphism UI** — Frosted glass input panel & header
- 📱 **Responsive grid** — Auto-adapts from 1 to 3+ columns

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Zustand | State management |
| Tailwind CSS 3 | Utility styling |
| Canvas 2D API | Star background (no WebGL) |
| CSS 3D Transforms | Card tilt & animations |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/todo-3d.git
cd todo-3d

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🚀 Deployment

### Build for production
```bash
npm run build
```
This generates an optimized `dist/` folder.

### Deploy to Netlify (drag & drop)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist/` folder onto the deploy zone ✅

### Deploy to Vercel
```bash
npx vercel
```

---

## 🎮 How to Use

| Action | How |
|--------|-----|
| **Add a task** | Type in the bottom input → select category & priority → click **+ Launch** |
| **Complete a task** | Click **✓ Done** on any card |
| **Undo completion** | Click **↩ Undo** on a completed card |
| **Delete a task** | Click **✕ Delete** → card dissolves |
| **Track progress** | Watch the ring in the top-right corner |

---

## 📁 Project Structure

```
todo-3d/
├── public/
├── src/
│   ├── components/
│   │   ├── SpaceBackground.jsx   # Canvas 2D animated stars
│   │   ├── TodoCard.jsx          # CSS 3D tilt card
│   │   └── UI/
│   │       ├── Header.jsx        # App title + status
│   │       ├── InputPanel.jsx    # Glassmorphism input form
│   │       └── ProgressRing.jsx  # SVG completion ring
│   ├── store/
│   │   └── useTodoStore.js       # Zustand state management
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                 # All animations & styles
├── index.html
└── package.json
```

---

## 📄 License

MIT © 2026 — Built with ❤️ and a lot of stardust 🌟
