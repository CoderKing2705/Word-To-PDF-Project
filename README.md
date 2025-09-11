# Word-to-PDF Converter 📝➡️📄

A full-stack application that allows users to upload Word (`.doc` / `.docx`) documents and converts them into PDF format.  
Built with **Angular** (frontend), **Next.js + Node** (backend), **Prisma** (database) and **LibreOffice** for document conversion.

---

## ✨ Features

- 🔐 **Authentication** (Login / Signup)
- 📤 **Upload** Word files up to 10 MB
- ⚡ **Convert** to PDF on the server using LibreOffice
- 📝 **Conversion History** – view all your uploads and their statuses
- ⬇️ **Download PDFs** once conversion is done
- 🎨 Modern, responsive UI with premium-looking design
- ❓ **About & Help** sections for user guidance

---

## 🖥️ Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend       | Angular 17 + Tailwind CSS           |
| Backend API    | Next.js 14 (App Router)             |
| Database       | Prisma ORM (e.g. PostgreSQL / SQLite)|
| Conversion     | LibreOffice (`libreoffice-convert`) |

---

## 🚀 Getting Started (Development)

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- LibreOffice installed locally and available in your PATH  
  *(On Windows: install LibreOffice and note its `soffice.exe` path)*
