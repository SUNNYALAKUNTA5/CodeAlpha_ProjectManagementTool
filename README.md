# 🧠 TaskSphere  
### A Smart and Minimal Project Management Tool

TaskSphere is a clean, modern, and responsive project management web app built with the MERN stack. It lets users create projects, manage tasks, add comments, and track progress with a simple, startup-style UI.

---

## 🚀 Demo

Live Demo: https://tasksphere-one.vercel.app

---

## ✨ Features

- 🔐 User Authentication — JWT-based auth with bcrypt-secured passwords  
- 🧱 Project Dashboard — Create, update, delete projects  
- 📋 Task Management — Add, move (Todo → In Progress → Done), and delete tasks  
- 💬 Comments — Add and manage comments on tasks (authenticated users only)  
- 🧩 Cascade Deletion — Deleting a project removes its tasks and comments  
- 🎨 Modern UI — Built with Bootstrap 5 and a custom gradient theme  
- 📱 Responsive Design — Desktop, tablet, and mobile support  
- ⚡ Toast Notifications — Instant success / error feedback

Note: This MVP focuses on core functionality. Members, assignments, and role-based permissions are planned for future releases.

---

## 🧠 Tech Stack

- Frontend: React (Vite) + Bootstrap 5 + Axios  
- Backend: Node.js + Express.js + MongoDB (Mongoose)  
- Auth: JSON Web Token (JWT) + bcrypt  
- Tools: Vite, npm, Git — deploy on Render / Vercel / Heroku

---

## 🧰 Installation & Setup (Windows / PowerShell)

Clone the repo and install dependencies for each workspace (frontend and backend).

1. Clone repository
```powershell
git clone https://github.com/SUNNYALAKUNTA5/CodeAlpha_ProjectManagementTool.git
cd CodeAlpha_ProjectManagementTool
```

2. Install dependencies

- install both root workspaces separately
```powershell
# Frontend
cd frontend
npm install

# Backend (in a new terminal)
cd ..\backend
npm install
```

3. Environment variables

- Frontend: create frontend/.env
```env
VITE_BACKEND_URL=http://localhost:5000
```

- Backend: create backend/.env (example)
```env
PORT=5000
MONGO_URI=mongodb:mongo_connection_string
JWT_SECRET=your_jwt_secret_here
```

4. Start development servers

Open two terminals:

- Frontend
```powershell
cd frontend
npm run dev
```

- Backend
```powershell
cd backend
npm run dev   
```

---

## 🗂️ Full Project Folder Structure

Project_Management_Tool/
├── README.md  
├── .gitignore  
├── frontend/  
│   ├── .env  
│   ├── index.html  
│   ├── package.json  
│   ├── vite.config.js  
│   ├── public/  
│   │   ├── bootstrap/  
│   │   └── vite.svg  
│   └── src/  
│       ├── App.jsx  
│       ├── main.jsx  
│       ├── components/  
│       │   ├── Navbar.jsx  
│       │   ├── ToastNotification.jsx  
│       │   ├── CommentComponent.jsx  
│       │   └── ProtectedRoute.jsx  
│       ├── pages/  
│       │   ├── Home.jsx  
│       │   ├── Login.jsx  
│       │   ├── Register.jsx  
│       │   ├── Dashboard.jsx  
│       │   └── ProjectBoard.jsx  
│       ├── utils/  
│       │   └── auth.js  
│
└── backend/  
    ├── .env  
    ├── package.json  
    ├── server.js  
    ├── config/  
    │   └── db.js  
    ├── controllers/  
    │   ├── authController.js  
    │   ├── projectController.js  
    │   ├── taskController.js  
    │   └── commentController.js  
    ├── models/  
    │   ├── User.js  
    │   ├── Project.js  
    │   ├── Task.js  
    │   └── Comment.js  
    ├── routes/  
    │   ├── authRoutes.js  
    │   ├── projectRoutes.js  
    │   ├── taskRoutes.js  
    │   └── commentRoutes.js  
    ├── middleware/  
    │   └── authMiddleware.js  

---

## 📡 API Endpoints (summary)

All endpoints that access user-specific data require an Authorization header: Authorization: Bearer <token>

- POST /api/auth/register — Register a new user  
- POST /api/auth/login — Authenticate and receive JWT  
- GET /api/projects — Get projects for the authenticated user  
- POST /api/projects — Create a new project  
- PUT /api/projects/:id — Update a project  
- DELETE /api/projects/:id — Delete a project (cascades to tasks & comments)  
- GET /api/tasks/project/:projectId — Get tasks for a project  
- POST /api/tasks — Create a task  
- PUT /api/tasks/:id — Update a task (status/description)  
- DELETE /api/tasks/:id — Delete a task  
- GET /api/comments/task/:taskId — Get comments for a task  
- POST /api/comments — Add a comment  
- DELETE /api/comments/:id — Delete a comment

---

## 📈 Future Improvements

- Project members and task assignment  
- Due dates, priorities, filtering and sorting  
- Real-time updates via Socket.io  
- Dark / light theme toggle  
- Analytics dashboard and exportable reports

---

## 🤝 Contributing

Contributions welcome. For significant changes, open an issue first. Use feature branches and create PRs with clear descriptions.

---

## 📄 License

MIT License

Copyright (c) 2025 Alakunta Sunny

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---

## 👨‍💻 Author

Alakunta Sunny  
- GitHub: https://github.com/SUNNYALAKUNTA5  
- [LinkedIn](https://www.linkedin.com/in/sunny-alakunta-355bb42ba/)

> “TaskSphere — where ideas take shape, one task at a time.” 🚀
