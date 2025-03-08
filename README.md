# Translation Tool

## 📌 Project Description

As part of an academic assignment I was asked to implement an automatic translation tool for both
English-to-French and French-to-English translation by using the Binary search Tree (BST). 

The application provides:
- Quick translations between English and French
- Vocabulary practice for common expressions needed in real-world interactions
- An intuitive learning tool to build confidence in English language use

## 🌍 App Overview

This app consists of two main components:

### 1. Backend API (Flask)
- RESTful API for translation services
- Binary Search Tree (BST) implementation for efficient word lookups
- Support for bidirectional translation (English-to-French and French-to-English)
- File upload functionality for bulk word imports (Excel, TXT)
- Dictionary management capabilities (add, modify, delete word pairs)

### 2. Frontend Application (Next.js)
- Modern, responsive user interface
- Translation interface with language swap functionality
- Admin dashboard for dictionary management
- File upload interface for importing translation dictionaries
- Real-time translation capabilities

## Technologies and Tools Used

### 🔹 Backend
- **Python**: Core programming language
- **Flask**: Web framework for building the API
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **Binary Search Trees (BST)**: Custom data structure for efficient word lookups
- **OpenPyXL**: For Excel file processing
- **Werkzeug**: Utilities for file handling and security

### 🔹 Frontend
- **Next.js **
- **React **
- **TypeScript**
- **Tailwind CSS 4**
- **Axios** 
- **Geist Font**

### Development and Deployment
- **Render**: Cloud platform for deploying the backend API
- **Vercel** (recommended): For deploying the Next.js frontend
- **Git**: Version control
- **npm/yarn**: Package management

---

### 🚀 Deployment Instructions


1. **Clone the repository**
   ```bash
   git clone https://github.com/Mariussgal/translation_app.git
   ```

### Backend Deployment

2. **Install Python dependencies & start the backend server**
   ```bash
   cd backend
   pip install -r requirements.txt
   python api.py
   ```
   The API will be available at `http://localhost:5000`.

3. **Set environment variables**
   Create a `.env.local` file in the `translate_app` directory:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api-url
   ```

### Frontend Deployment

4. **Navigate to the frontend directory & install dependencies**
   ```bash
   cd translate_app
   npm install
   ```

5. **Build and start the application**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.
   


## File Structure Overview

```
translation_app/
├── backend/                  # Python Flask backend
│   ├── api.py                # Main API entry point
│   ├── dictionary_management.py # Dictionary CRUD operations
│   ├── file_upload.py        # File upload handling
│   ├── main.py               # BST implementation
│   └── requirements.txt      # Python dependencies
│
├── translate_app/            # Next.js frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── app/              # Next.js App Router
│   │   │   ├── dashboard/    # Admin dashboard
│   │   │   ├── globals.css   # Global styles
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── page.tsx      # Home page (translator)
│   │   └── lib/              # Shared utilities
│   │       └── api.ts        # API client
│   ├── .env.local            # Environment variables (create this)
│   ├── package.json          # NPM dependencies
│   └── tailwind.config.js    # Tailwind CSS configuration
│
└── render.yaml               # Render deployment configuration
```

## Binary Search Tree Implementation

The core of this application is a custom Binary Search Tree (BST) implementation that enables efficient word lookups. The BST data structure allows for:

- O(log n) search time complexity for translation lookups
- O(log n) insertion time for adding new word pairs
- Support for multiple translations per word (homonyms)

In our implementation, each node in the tree contains:
- A key (the word to translate)
- A set of values (possible translations)
- Left and right child references

This structure was chosen to optimize the translation process while maintaining the ability to expand the dictionary over time.
