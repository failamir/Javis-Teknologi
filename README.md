# Javis Teknologi Albarokah - Web Programmer Challenge

A secure authentication system built as part of the PT Javis Teknologi Albarokah Technical Challenge. This application features a robust login system, protected routes, and a modern, responsive dashboard.

## 🚀 Features

- **Secure Authentication**: Implemented using JWT (JSON Web Tokens) and HttpOnly Cookies for maximum security against XSS.
- **Protected Routes**: Middleware-based protection for the `/dashboard` route.
- **Responsive UI**: A beautiful, modern interface built with Next.js, Tailwind CSS, and Framer Motion.
- **Database Integration**: Prisma ORM with PostgreSQL for reliable data management.
- **Security Bonus**: 
  - Rate limiting on the login endpoint to prevent brute-force attacks.
  - Password hashing using `bcryptjs`.
  - Secure input validation and sanitization.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: `jose` (JWT) + HttpOnly Cookies
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A PostgreSQL database (local or cloud-based like Vercel Postgres)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Javis-Teknologi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-strong-random-secret"
   ```

4. **Database Setup**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

- **Auth Layer**: Authentication is handled via Next.js API Routes. Upon successful login, a JWT is generated and stored in a secure, HttpOnly cookie.
- **Middleware**: A `middleware.ts` file intercepts requests to `/dashboard`, verifying the JWT before allowing access.
- **Session Management**: Session state is persistent across reloads and protected from client-side script access.

## 🔑 Demo Credentials

- **Username**: `admin`
- **Email**: `admin@javis.id`
- **Password**: `password123`

---

Built with ❤️ for PT Javis Teknologi Albarokah.
