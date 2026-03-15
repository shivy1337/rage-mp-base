# 🎮 ONY Gamemode — RAGE:MP

**A minimal, production-ready RAGE:MP base gamemode**

Login · Register · MySQL · Admin System

![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=flat&logo=javascript&logoColor=black)
![RAGE:MP](https://img.shields.io/badge/RAGE:MP-1.1+-e8452a?style=flat)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?style=flat&logo=mysql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat)

---

## ✨ Features

- **Login / Register** — Secure authentication with hashed passwords
- **MySQL Integration** — Player data persistence via MySQL
- **Admin System** — Role-based admin levels with in-game management
- **Essential Commands** — Core commands for admins and players

---

## 🛠️ Commands

| Command | Description | Permission |
|---|---|---|
| `/setadmin <id> <level>` | Set a player's admin level | Admin |
| `/flip` | Flip your vehicle upright | All |
| `/noclip` | Toggle noclip mode | Admin |
| `/veh <model>` | Spawn a vehicle | Admin |

---

## 📦 Requirements

- [RAGE:MP Server](https://rage.mp/) `>= 1.1`
- [Node.js](https://nodejs.org/) `>= 16.x`
- MySQL `>= 5.7` or MariaDB `>= 10.x`

---

## ⚙️ Setup

**1. Clone the repository**

```bash
git clone https://github.com/shivy1337/rage-mp-base.git
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure the database**

Edit `conf.json` with your MySQL credentials:

```json
{
  "db": {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",
    "database": "ragemp_ony"
  }
}
```

**4. Copy to your RAGE:MP server**

Copy `packages/ony` into your server's `packages/` folder and `client_packages` into your server's `client_packages/` folder, then start the server:

```bash
ragemp-server
```

---

## 📁 Project Structure

```
rage-mp-base/
├── conf.json               # Server & database config
├── package.json
├── packages/
│   └── ony/
│       └── index.js        # Server-side entry point
└── client_packages/
    └── index.js            # Client-side entry point
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made by [shivy](https://github.com/shivy1337)
