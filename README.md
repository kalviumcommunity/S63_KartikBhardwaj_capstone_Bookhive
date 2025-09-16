<h1 align="center">📚✨ BookHive – Discover, Review & Connect ✨📚</h1>

<div align="center">

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Orbitron&size=26&duration=2500&pause=1000&color=00F7FF&center=true&vCenter=true&width=800&lines=Your+Next+Book+Awaits...;Discover+%7C+Review+%7C+Connect+Worldwide;Built+with+MERN+Stack+%F0%9F%92%BB;Join+the+Future+of+Reading+%F0%9F%9A%80)

[![Frontend](https://img.shields.io/badge/🚀_Live_Frontend-BookHiveee.netlify.app-00F7FF?style=for-the-badge&logo=vercel&logoColor=white)](https://bookhiveee.netlify.app/)  
[![Backend](https://img.shields.io/badge/⚡_Live_Backend-Render_API-7FFF00?style=for-the-badge&logo=render&logoColor=white)](https://s63-kartikbhardwaj-capstone-bookhive-1.onrender.com)  

</div>

---

## 🪐 Why BookHive?  

> *"Not just a project — a futuristic reading community hub powered by MERN."*  

- 🔍 **Smart Book Discovery** – find books with AI-powered filters  
- 📝 **Dynamic Reviews** – CRUD reviews + rating system  
- 🌟 **Community Driven** – follow, upvote, connect  
- 🛡️ **Secure Auth** – Email OTP + Google Sign-In  
- 🧭 **Admin Tools** – manage users, books, reviews  

---

## 🌌 Features Breakdown  

<details>
<summary>🔎 Book Discovery</summary>
<img src="https://img.shields.io/badge/SEARCH-AI%20Powered-blueviolet?style=flat-square" />
  
- Find books by title, author, or genre  
- Detailed metadata & community ratings  
</details>

<details>
<summary>📝 Review System</summary>
<img src="https://img.shields.io/badge/CRUD-Reviews-orange?style=flat-square" />

- Write, edit, delete reviews  
- Star ratings (⭐ 1–5)  
- Upvote helpful reviews  
</details>

<details>
<summary>👤 User Profiles</summary>
<img src="https://img.shields.io/badge/PROFILE-Personalized-lightblue?style=flat-square" />

- Track reading history & wishlist  
- Follow / Unfollow users  
- Dashboard with live stats  
</details>

<details>
<summary>🛡️ Admin Panel</summary>
<img src="https://img.shields.io/badge/MODERATION-Active-red?style=flat-square" />

- Review moderation  
- Manage accounts & books  
</details>

---

## 🖼️ Futuristic UI Sneak Peek  

> (*replace with your screenshots/GIFs later*)  

| Landing Page | Dashboard | Profile |  
|--------------|-----------|---------|  
| ![Landing](https://via.placeholder.com/400x220?text=Landing+Page) | ![Dashboard](https://via.placeholder.com/400x220?text=Dashboard) | ![Profile](https://via.placeholder.com/400x220?text=Profile) |  

---

## 🛠️ Tech Stack  

<div align="center">

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)  
![Tailwind](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)  
![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
![Express](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)  
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)  
![Firebase](https://img.shields.io/badge/Auth-Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white)  
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)  
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)  

</div>  

---

## 🗓️ Roadmap  

- ✅ Week 1 → Auth + DB Setup  
- ✅ Week 2 → Books + Reviews  
- ✅ Week 3 → Profiles + Admin Tools  
- ✅ Week 4 → Testing + Deployment  
- 🌌 Coming Soon → Book Clubs, Challenges, Badges  

---

## 🔐 OTP Verification Flow  

```mermaid
sequenceDiagram
User->>Server: Signup Request
Server->>Email: Send OTP
User->>Server: Enter OTP
Server->>DB: Verify + Flag User as Verified
