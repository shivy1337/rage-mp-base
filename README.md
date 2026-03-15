# 🎮 Basic Gamemode — RAGE:MP

A clean, ready-to-use GTA V multiplayer gamemode built with RAGE:MP, featuring a full login/register system, MySQL database integration, and essential admin tools.

---

## ✨ Features

- **Login / Register** — Secure authentication system with hashed passwords
- **MySQL Integration** — Player data persistence via MySQL database
- **Admin System** — Role-based admin levels with in-game management
- **Essential Commands** — Core commands for admins and testing

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
git clone https://github.com/shivy1337/basic-gamemode.git
cd basic-gamemode
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure the database**

Edit `config.json` with your MySQL credentials:
```json
{
  "db": {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",
    "database": "ragemp_gamemode"
  }
}
```

**4. Import the database schema**
```bash
mysql -u root -p ragemp_gamemode < schema.sql
```

**5. Copy files to your RAGE:MP server**

Place the `packages/gamemode` folder inside your server's `packages/` directory, then start the server:
```bash
ragemp-server
```

---

## 📁 Project Structure

```
packages/
└── gamemode/
    ├── index.js          # Entry point
    ├── config.json       # Database & server config
    ├── modules/
    │   ├── auth.js       # Login / register logic
    │   ├── admin.js      # Admin system & commands
    │   └── vehicle.js    # Vehicle commands
    └── schema.sql        # Database schema
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made by <a href="https://github.com/shivy1337">shivy</a></p>
