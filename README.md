# Authenticated CSV Upload - Quickstart

Quick setup to run the CSV upload backend with authentication and CSV download.

---

## 1. Clone Repo

```bash
git clone 
cd authenticated-csv-upload
```

## 2. Environment Variables

Create `.env`:

```env
PORT=8080
DATABASE_URL=postgresql://postgres:Your_Password@csv-db:5432/csvdb
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=
BCRYPT_ROUNDS=
UPLOAD_PATH=/uploads
```

---

## 3. Run with Docker

```bash
docker compose up --build
```

* App runs at `http://localhost:8080`
* PostgreSQL runs in a separate container with persistent volume

---

## 4. Optional: Prisma Studio

```bash
docker compose exec app npx prisma studio
```

---

## 5. Test Frontend

Open:

```
http://localhost:8080/index.html
```

* Register / login
* Upload CSV
* View and download records

---

## 6. Deployment

```bash
docker compose up --build -d
```

Use a reverse proxy (like Nginx) and SSL for production.

---

**Notes:**

* JWT authentication required for CSV upload/download.
* Admin sees all records; normal users see only their own.
* Uploaded files persist via Docker volume (`/uploads`).
