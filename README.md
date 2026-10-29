# ClubSphere — College Club Management Portal

**EMA3151 Full Stack Development using Java Practical Examination**

ClubSphere is a full-stack web application developed using **Spring Boot (Java 21)**, **Spring Data JPA**, **H2 In-Memory Database**, and **React (Vite + JavaScript)**. It manages college clubs and streamlines communication between students, faculty members, and club coordinators.

---

## 📋 Features Implemented

1. **Add Student, Faculty, and Coordinator Details**:
   - Comprehensive form to add and edit records with Name, Roll Number or Employee ID (as applicable), Branch, and Marks/Percentage.
   - Dynamic labeling based on selected role.
2. **Display Saved Records**:
   - Organized, styled table displaying all saved records with badges, branch, marks, and associated clubs.
   - Filterable by role tabs (All, Students, Faculty, Coordinators).
3. **Club Faculty and Coordinator Details**:
   - Dedicated "Clubs & Leadership" section presenting each club along with its Faculty In-Charge (Name, Employee ID, Branch) and Student Coordinator (Name, Roll No, Branch).
4. **Search Functionality**:
   - Real-time search bar to look up records by **Name**, **Roll Number or Employee ID**, and **Branch**.
5. **Total Student Count**:
   - Prominently displayed KPI and badge indicating the total count of registered students.
   - Automatically synchronizes and updates whenever a student record is added or deleted.
6. **Data Management (CRUD)**:
   - Full persistence through H2 In-Memory Database.
   - Authorized users can Add, Edit (modal dialog), and Delete records.
7. **Role-Based Access**:
   - Interactive role switcher for **Student**, **Faculty Member**, and **Club Coordinator**.
   - Students can explore clubs, submit join requests, track request statuses, and read announcements.
   - Faculty & Coordinators can manage member records, review join applications (Accept / Reject), and broadcast circulars.
8. **Notifications and Announcements**:
   - Chronological bulletin board for events, urgent alerts, and circulars with category tags.
   - Live top alert ticker for urgent announcements.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, JavaScript (ES6+), HTML5, CSS3, Fetch API |
| **Backend** | Java 21 (Temurin JDK), Spring Boot 3.3.4, Spring Web, Spring Data JPA |
| **Database** | H2 In-Memory Database (`jdbc:h2:mem:clubspheredb`) |
| **Build Tools** | Apache Maven 3.9.16, npm 11.16.0 / Node.js 24 |

---

## 🚀 Running the Project

### 1. Spring Boot Backend
```powershell
cd backend
mvn spring-boot:run
```
- Server URL: `http://localhost:8080`
- H2 Web Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:clubspheredb`
  - Username: `sa`
  - Password: *(leave blank)*

### 2. React Vite Frontend
```powershell
cd frontend
npm.cmd run dev
```
- Web Application URL: `http://localhost:5173`

---

## 📡 REST API Endpoints

### Member Management
- `GET /api/members` — Retrieve all members or filter by query parameters (`?role=...` or `?search=...`).
- `GET /api/members/{id}` — Get single member by ID.
- `GET /api/members/count/students` — Get total count of registered students.
- `POST /api/members` — Add new student, faculty member, or coordinator.
- `PUT /api/members/{id}` — Update existing member details.
- `DELETE /api/members/{id}` — Delete member record.

### Club Management
- `GET /api/clubs` — List all clubs with associated faculty and coordinator details.
- `GET /api/clubs/{id}` — Get single club details.
- `POST /api/clubs` — Register a new club.
- `PUT /api/clubs/{id}` — Update club details.
- `DELETE /api/clubs/{id}` — Delete a club.

### Membership Requests
- `GET /api/requests` — Retrieve all join requests.
- `GET /api/requests/student/{rollNo}` — Retrieve requests submitted by a specific student.
- `POST /api/requests` — Submit a new club join request.
- `PUT /api/requests/{id}/status` — Accept or reject a student join request.
- `DELETE /api/requests/{id}` — Remove a request.

### Announcements & Alerts
- `GET /api/announcements` — List all notices and alerts (descending by time).
- `POST /api/announcements` — Publish a new announcement, event, or alert.
- `DELETE /api/announcements/{id}` — Delete an announcement.

