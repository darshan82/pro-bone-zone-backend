# Pro Bono Zone — Backend API

REST API powering **Pro Bono Zone**, a platform for organising pro bono legal clinics. It handles customer appointments, events, sponsors and promotions, territories, resources, blogs, and multi-role user management (admin / licensee / staff).

Frontend: [Pro-Bone-Zone](https://github.com/darshan82/Pro-Bone-Zone)

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

## Features

- **JWT authentication** with role-based access (admin, licensee, staff)
- **Appointments** – booking, updates and automatic email notifications via Nodemailer
- **Events & territories** – manage clinic events per territory/state
- **Sponsors & promotions** – sponsor profiles linked to promotional campaigns
- **Resources & blogs** – content management endpoints
- **File uploads** with Multer
- **Request validation** using `express-validator`
- Centralised async error handling (`utils/catchAsync.js`)

## Project structure

```
├── app.js              # Express app, middleware and route mounting
├── server.js           # Entry point
├── config.js           # Reads configuration from environment variables
├── sqlconnect.js       # MySQL connection
├── routes/             # Route definitions + validation rules
├── controllers/        # Request handlers / business logic
├── middlewares/Auth.js # JWT verification middleware
└── utils/              # Helpers
```

## API overview

| Resource      | Base path        | Examples                                         |
| ------------- | ---------------- | ------------------------------------------------ |
| Users / auth  | `/user`          | `POST /login`, `POST /signup`, `/licensee` CRUD  |
| Appointments  | `/appointment`   | `GET /`, `POST /add`, `PUT /:id/:customerId`     |
| Customers     | `/customer`      | CRUD                                             |
| Staff         | `/staff`         | `GET /`, `POST /add`                             |
| Events        | `/event`         | CRUD                                             |
| Territories   | `/territory`     | CRUD, `POST /query`                              |
| Sponsors      | `/sponsor`       | CRUD                                             |
| Promotions    | `/promotion`     | CRUD (protected)                                 |
| Resources     | `/resource`      | CRUD                                             |
| Blogs         | `/blogs`         | CRUD                                             |
| Uploads       | `/upload`        | `POST` multipart `file`                          |

Protected routes expect the JWT in the `Authorization` header.

## Getting started

**Requirements:** Node.js 18+, MySQL 8

```bash
git clone https://github.com/darshan82/pro-bone-zone-backend.git
cd pro-bone-zone-backend
npm install
cp .env.example .env   # then fill in your DB, JWT and SMTP values
npm run dev            # starts with nodemon on http://localhost:3000
```

| Script        | Description                    |
| ------------- | ------------------------------ |
| `npm start`   | Run the server with Node       |
| `npm run dev` | Run with auto-reload (nodemon) |

## Environment variables

See [`.env.example`](.env.example) for the full list: `PORT`, `JWT_SECRET`, `DB_*` and `SMTP_*`.

## Author

**Darshan Lal** — Full-Stack Developer
[Portfolio](https://darshan-portfolio-one.vercel.app/) · [GitHub](https://github.com/darshan82)
