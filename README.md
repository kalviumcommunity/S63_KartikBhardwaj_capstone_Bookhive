📚 BookHive – Discover, Review & Connect
Welcome to BookHive, a full-stack web application that connects book lovers around the world. Whether you're searching for your next read, sharing thoughtful reviews, or exploring diverse perspectives, BookHive makes it easy to dive deep into the world of books — together.

✨ Overview
BookHive is your go-to platform to:

🔍 Discover new books by title, author, or genre
✍️ Write and read insightful reviews
🌟 Rate books and engage with a vibrant reading community
👥 Connect with fellow readers and follow your favorite reviewers
📚 Build your personal library and track your reading journey

Whether you're a fan of thrilling mysteries, inspiring memoirs, or academic research — BookHive brings them all together under one interactive hub.


🚀 Features at a Glance
🔎 Book Discovery
1. Smart search by title, author, or genre
2. Detailed book view with summary, publication info, and community ratings


📝 Review System
1. Write, read, update, and delete reviews
2. Rate books (1–5 stars)
3. Upvote helpful reviews to highlight valuable insights


👤 User Profiles

1. Personalized dashboard with user stats
2. Track your reading history, favorite books, and wishlist
3. Follow and unfollow users to build a custom reading circle


🛠️ Admin Panel

1. Review moderation (report, approve, delete)
2. Manage user accounts and book entries



📈 Scalable Roadmap (Coming Soon)

1. Book clubs and discussion threads
2. Reading challenges and achievement badges
3. Advanced API integrations for richer book metadata


🗂️ Categories

Explore books across multiple domains:

1. 📘 Fiction – Fantasy, Sci-Fi, Romance, Mystery
2. 📕 Non-Fiction – Biographies, History, Self-Help
3. 📗 Academic – Textbooks, Research Papers

🛠️ Tech Stack

Layer	                     Technology

Frontend	                 React.js, Tailwind CSS, React Router
Backend	                     Node.js, Express.js, JWT Authentication
Database	                 MongoDB + Mongoose
APIs & Auth	                 Google Books API, Firebase (Google Sign-In), Email OTP Verification
Deployment	                 Vercel (Frontend), Render (Backend), MongoDB Atlas (Cloud DB)




🧭 UI Flow

1. 🏠 Landing Page: Hero section, search bar, featured books, and call-to-action buttons
2. 🔐 Authentication: Email OTP Verification, Google OAuth, password reset
3. 📚 Dashboard: Book filters, responsive grid, modals for book details and reviews
4. 👤 Profile Page: User stats, reading history, wishlist, and account settings
5. 🛡️ Admin Panel: Manage reviews, users, and book content with moderation tools

🗓️ Development Roadmap
Week 1: Setup & Authentication

✅ Initialize frontend (Vite + React) and backend (Express)
✅ MongoDB + Mongoose schemas (User, Book, Review)
✅ JWT-based authentication
✅ Google OAuth integration via Firebase
✅ Secure protected routes
✅ Deploy backend to Render for testing


Week 2: Core Features

✅ Integrate Google Books API for dynamic search
✅ Book detail pages with metadata and reviews
✅ Full CRUD review system
✅ Link users to reviews and books
✅ Build user profile and follow system
✅ User flow testing (search, review, follow)



Week 3: UI/UX & Admin Tools

✅ Responsive UI with Tailwind CSS
✅ Admin dashboard
✅ Review moderation (report, delete)
✅ Pagination for books and reviews
✅ API performance improvements via caching
✅ UI polish and optional animations (Framer Motion)
✅ Internal feature demo




Week 4: Testing & Launch

✅ Backend testing via Postman
✅ Frontend testing (Jest, React Testing Library)
✅ Debugging and bug fixes
✅ Final deployments: Vercel (frontend) & Render (backend)
✅ Write final documentation & record demo video



🧪 Testing Tools

1. 🧼 Backend Testing: Postman
2. 🧪 Frontend Unit Tests: Jest, React Testing Library



🌐 Live Links

1. 🔗 Frontend: BookHive on Netlify
2. 🔗 Backend API: BookHive API on Render



🔐 Email OTP Verification System
 BookHive implements a secure OTP-based email verification system during user signup to ensure authenticity and reduce spam registrations.

🛠️ How it Works:

1. Upon signup, an OTP is generated server-side and logged to the console
2. The user is prompted to enter the OTP for verification
3. Once confirmed, the account is flagged as email-verified



🧑‍💻 Developer Notes:

1. 📄 backend/OTP_VERIFICATION_GUIDE.md – Setup and usage instructions
2. ⚙️ backend/services/hybridOtpService.js – OTP generation logic
3. 🔐 backend/routes/auth.js – Routes for signup and OTP validation

To upgrade for production, integrate with email providers like:

1. SendGrid
2. Mailgun
3. AWS SES



🏁 Conclusion
BookHive is more than a project — it’s a real-world scalable application designed with both community experience and developer best practices in mind. From clean architecture and modular design to thoughtful UI/UX and secure authentication, BookHive is ready to be showcased as a serious full-stack MERN application.

