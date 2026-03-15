<div align="center">

# rage-mp-base

**A minimal, production-ready RAGE:MP base gamemode**  
Login · Register · MySQL · Admin System

[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![RAGE:MP](https://img.shields.io/badge/RAGE:MP-1.1+-orange?style=flat-square)](https://rage.mp)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

</div>

---

## Overview

A clean base for GTA V multiplayer servers using RAGE:MP. Includes a full authentication system, persistent MySQL storage, role-based admin system, and essential player commands — everything you need to start building your server.

```
rage-mp-base/
├── packages/
│   └── ony/              # Server-side scripts
│       ├── index.js      # Entry point
│       ├── auth.js       # Login / register
│       ├── admin.js      # Admin system
│       └── commands.js   # In-game commands
├── client_packages/      # Client-side scripts
├── conf.json             # RAGE:MP server config
└── package.json
```

---

## Features

- **Authentication** — Secure login/register with bcrypt password hashing and session management
- **MySQL** — Full player data persistence via `mysql2` with connection pooling
- **Admin System** — Level-based admin ranks with in-game management commands
- **Vehicle Commands** — Spawn, flip, and manage vehicles in-game

---

## Commands

| Command | Description | Level |
|---|---|---|
| `/setadmin <id> <level>` | Set a player's admin level | Admin 5 |
| `/veh <model>` | Spawn a vehicle at your position | Admin 1 |
| `/noclip` | Toggle noclip mode | Admin 1 |
| `/flip` | Flip your current vehicle upright | Everyone |

---

## Requirements

- [RAGE:MP Server](https://rage.mp/) `>= 1.1`
- [Node.js](https://nodejs.org/) `>= 16.x`
- MySQL `>= 5.7` or MariaDB `>= 10.x`

---

## Setup

**1. Clone & install**
```bash
git clone https://github.com/shivy1337/rage-mp-base.git
cd rage-mp-base
npm install
```

**2. Create the database**
```sql
CREATE DATABASE ragemp;
USE ragemp;

CREATE TABLE players (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(64) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  admin_level INT NOT NULL DEFAULT 0,
  cash        INT NOT NULL DEFAULT 5000,
  last_pos_x  FLOAT DEFAULT 0,
  last_pos_y  FLOAT DEFAULT 0,
  last_pos_z  FLOAT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**3. Configure `conf.json`**
```json
{
  "maxplayers": 100,
  "name": "My RAGE:MP Server",
  "gamemode": "ony",
  "stream-distance": 300,
  "mysql": {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",
    "database": "ragemp"
  }
}
```

**4. Copy to your RAGE:MP server folder**
```
server-files/
├── packages/        ← copy packages/ony here
├── client_packages/ ← copy client_packages contents here
└── conf.json        ← replace with yours
```

**5. Start the server**
```bash
./ragemp-server        # Linux
ragemp-server.exe      # Windows
```

---

## How it works

**Authentication** — on player connect, the server queries the `players` table by name. If the player exists, a login dialog is shown and the password is verified with `bcrypt.compare()`. If not, a register dialog creates a new row with a hashed password.

```js
// packages/ony/auth.js (simplified)
const bcrypt = require('bcryptjs');
const db     = require('./db');

mp.events.add('playerReady', (player) => {
    db.query('SELECT * FROM players WHERE name = ?', [player.name], (err, rows) => {
        if (rows.length > 0) {
            player.call('showLoginDialog');
        } else {
            player.call('showRegisterDialog');
        }
    });
});

mp.events.addProc('tryLogin', async (player, password) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM players WHERE name = ?', [player.name]
    );
    if (!rows.length) return 'not_found';
    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return 'wrong_password';
    player.data = rows[0];
    player.spawn(new mp.Vector3(rows[0].last_pos_x, rows[0].last_pos_y, rows[0].last_pos_z));
    return 'success';
});
```

**MySQL connection pool** — `db.js` exports a pooled connection so queries are non-blocking across all modules.

```js
// packages/ony/db.js
const mysql = require('mysql2');
const conf  = require('../../conf.json');

const pool = mysql.createPool({
    host:               conf.mysql.host,
    user:               conf.mysql.user,
    password:           conf.mysql.password,
    database:           conf.mysql.database,
    waitForConnections: true,
    connectionLimit:    10,
});

module.exports = pool;
```

**Admin commands** — admin level is loaded from the database on login and checked before every restricted command.

```js
// packages/ony/commands.js (simplified)
mp.events.addCommand('setadmin', (player, _, targetId, level) => {
    if (player.data.admin_level < 5)
        return player.outputChatBox('!{FF0000}No permission.');

    const target = mp.players.at(parseInt(targetId));
    if (!target) return player.outputChatBox('!{FF0000}Player not found.');

    target.data.admin_level = parseInt(level);
    db.query('UPDATE players SET admin_level = ? WHERE id = ?', [level, target.data.id]);
    player.outputChatBox(`!{00FF00}Set ${target.name}'s admin level to ${level}.`);
});

mp.events.addCommand('flip', (player) => {
    if (!player.vehicle)
        return player.outputChatBox('!{FF0000}You are not in a vehicle.');
    player.vehicle.rotation = new mp.Vector3(0, 0, player.vehicle.rotation.z);
});
```

---

## License

MIT — do whatever you want with it.

---

<div align="center">
  Made by <a href="https://github.com/shivy1337">shivy</a>
</div>
