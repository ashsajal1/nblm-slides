# ফ্ল্যাশকার্ড — Flashcard Study App

A Bengali/English flashcard study application with multi-language UI support. Upload CSV files (including exports from Google NotebookLM) and study flashcards with an interactive slideshow.

Supports **8 languages**: Bengali, English, Japanese, Chinese, French, Spanish, Hindi, German.

## Features

- **Multi-language UI** — Switch between 8 languages instantly
- **CSV Upload** — Drag & drop or click to upload flashcard decks
- **Google NotebookLM Compatible** — Import quiz CSVs directly from NotebookLM
- **Interactive Slideshow** — Navigate flashcards with keyboard or click
- **Topic Organization** — Filter decks by topic (study, science, history, etc.)
- **CRUD Management** — Create, edit, delete decks and individual cards
- **IndexedDB Persistence** — Decks saved locally in your browser
- **Dark/Light Mode** — Toggle between themes
- **PWA Support** — Install as a desktop or mobile app
- **Responsive Design** — Works on desktop and mobile

## Quick Start

```sh
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## How to Use

### 1. Upload Flashcard CSV

On the home page, drag and drop a `.csv` file or click the **Upload CSV** button.

After uploading:
1. Enter a **title** for your deck
2. Select a **topic** (study, science, history, language, custom)
3. Click **Save**

Your deck will appear as a tab. Click it to start studying.

### 2. Study with Slideshow

- Click **Show Answer** or press **Space / Enter** to reveal the answer
- Use **← →** arrow keys or click the arrows to navigate
- Progress bar shows your position in the deck

### 3. Manage Decks & Cards

Go to the **Slides** page (`/slides`) to:
- View all decks in a grid
- Filter by topic
- Edit deck title and topic
- Add, edit, or delete individual cards
- Create custom topics
- Delete entire decks

### 4. Change Language

Click the **Globe** icon in the top navigation bar and select your language.

---

## Importing from Google NotebookLM

Google NotebookLM can export flashcards as a CSV file. Follow these steps to import them:

### Step 1: Create or Open a Notebook in NotebookLM

1. Go to [NotebookLM](https://notebooklm.google.com/) (you need a Google account)
2. Create a new Notebook or open an existing one
3. Add sources (PDFs, websites, YouTube videos, Google Docs) for NotebookLM to analyze

### Step 2: Install NotebookLM Flashcard Exporter

Google NotebookLM doesn't export flashcards directly to CSV. Use the **NotebookLM Ultra Exporter** Chrome extension to convert your flashcard sets:

1. Install [NotebookLM Ultra Exporter](https://chromewebstore.google.com/detail/notebooklm-ultra-exporter/afchokljnhhggkhedfbmkcmdagjmjchj) from the Chrome Web Store
2. Click the extension icon in Chrome and grant permissions to NotebookLM
3. Open your NotebookLM notebook with flashcards

### Step 3: Export Flashcards as CSV

1. In your NotebookLM notebook, click the **Flashcards** button to generate flashcards from your sources
2. Click the **NotebookLM Ultra Exporter** extension icon
3. Select **Export to CSV** — it will generate a properly formatted CSV file and download it automatically

> **Note:** If you don't use the exporter extension, NotebookLM's built-in download may export as JSON or text format, which will need manual conversion to CSV.

### Step 4: Convert to App Format (if needed)

The NotebookLM Ultra Exporter extension formats the CSV correctly by default. However, if you get an "Invalid CSV format" error, ensure your CSV has this structure:

```csv
"Question","Answer"
"What is photosynthesis?","The process by which plants convert sunlight into energy"
"What is the capital of France?","Paris"
```

**Required format:**
- Column 1: Question (header must contain `Question` or `প্রশ্ন` or `问题`)
- Column 2: Answer (header must contain `Answer` or `উত্তর` or `答案`)
- Fields enclosed in double quotes
- Comma-separated

### Step 5: Upload to the App

1. Go to the app home page
2. Drag and drop the CSV file
3. Assign a title and topic
4. Click Save and start studying!

### Sample CSV

```csv
"প্রশ্ন (Question)","উত্তর (Answer)"
"বাংলাদেশের রাজধানী কী?","ঢাকা"
"সূর্য কি?","নক্ষত্র"
"পানির রাসায়নিক সংকেত কী?","H2O"
```

---

## Project Structure

```
nblm-slides/
├── public/                  # Static assets (favicon, PWA icons)
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── custom-ui/      # Custom components (Text, Particles, Search)
│   │   ├── partials/       # Layout (Navbar, Footer, SideNav)
│   │   ├── language-switcher.tsx   # Language dropdown
│   │   └── mode-toggle.tsx        # Theme toggle
│   ├── hooks/
│   ├── i18n/
│   │   ├── index.ts        # i18next configuration
│   │   └── locales/        # Translation JSON files (bn, en, ja, zh, fr, es, hi, de)
│   ├── lib/
│   │   ├── db/
│   │   │   └── indexedDB.ts # IndexedDB for flashcard storage
│   │   └── store/           # Redux store
│   ├── pages/
│   │   ├── home.tsx        # Main flashcard slideshow
│   │   ├── slides.tsx      # Deck management
│   │   ├── features.tsx
│   │   ├── pricing.tsx
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   ├── blog.tsx
│   │   ├── docs.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── not-found.tsx
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts           # Vite + PWA configuration
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Adding New Languages

To add a new language:

1. Create a new JSON file in `src/i18n/locales/` (e.g., `pt.json`)
2. Copy the structure from `en.json` and translate all values
3. Register the language in `src/i18n/index.ts`:

```ts
import pt from './locales/pt.json';

export const languages = [
  // ... existing languages ...
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];
```

4. Add to resources:
```ts
resources: {
  // ... existing ...
  pt: { translation: pt },
}
```

## CSV Format Reference

| Column Header (any of) | Description |
|------------------------|-------------|
| `Question`, `প্রশ্ন`, `问题` | The question/front of card |
| `Answer`, `উত্তর`, `答案` | The answer/back of card |

**Example:**
```csv
"Question","Answer"
"What is the largest planet?","Jupiter"
"Who wrote Hamlet?","William Shakespeare"
```

**Bengali example:**
```csv
"প্রশ্ন","উত্তর"
"ভারতের রাজধানী কী?","নতুন দিল্লি"
"সর্বোচ্চ পর্বত কোনটি?","মাউন্ট এভারেস্ট"
```

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** (animations)
- **react-i18next** (internationalization)
- **IndexedDB** via **idb** (local storage)
- **PWA** (vite-plugin-pwa)
- **React Router DOM** (routing)

## Prerequisites

- **Node.js** v18+
- **Pnpm** v8+ (recommended) or npm

## License

MIT — Built with ❤️ by Sajal.
