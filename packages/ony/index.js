const mysql = require("mysql");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ony"
});

db.connect((err) => {
   if (err) throw err;
    console.log("[ONY] Database connected");
 
});

db.query(`
    CREATE TABLE IF NOT EXISTS players (id INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    money INT DEFAULT 0, 
    score INT DEFAULT 0, 
    team VARCHAR(10) DEFAULT 'none')`);
db.query('ALTER TABLE players ADD COLUMN IF NOT EXISTS admin INT DEFAULT 0');

const ranks = ['', 'Newbie', 'Advanced', 'Administrator', 'Head of Staff', 'Founder', 'Developer'];

const loggedIn = {};

mp.events.addCommand('register', (player, password) => {
    if (!password) return player.outputChatBox('!{FFD700}Use: /register [parola]');
    db.query('SELECT * FROM players WHERE username = ?', [player.name], (err, results) => {
    
        if (results.length > 0) return player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}This account exist already!'); 
        bcrypt.hash(password, 10, (err, hash) => {
            db.query('INSERT INTO players (username, password) VALUES (?, ?)', [player.name, hash], (err) => {
                if (err) return player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Error! Try again later');
                player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Account created! Use /login [pass]');
            });
        });
    });
});

mp.events.addCommand('login', (player, password) => {
    if (!password) return player.outputChatBox('!{FFD700}Use: !{{FFFFFF}/login [pass]');
        db.query('SELECT * FROM players WHERE username = ?', [player.name], (err, results) => {
            if (results.length === 0) return player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Account not found!');
                bcrypt.compare(password, results[0].password, (err, match) => {
                    if (!match) return player.outputChatBox('!{FF0000}[ONY] !{FFFFFF}Wrong password!');
                        player.outputChatBox('!{00FF00}[ONY] !{FFFFFF}You logged in!');
                        loggedIn[player.name] = true;
                        player.call('freezePlayer', [false]);

       });
    });
});

mp.events.addCommand('setadmin', (player, fullText) => {
    if (player.name !== 'shivy') return player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}No permission!');
    if (!fullText) return player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Use: /setadmin [id] [level] [reason]');
    const shivy = fullText.split(' ');
    const target = mp.players.at(parseInt(shivy[0]));
    const level = parseInt(shivy[1]);
    const reason = shivy.slice(2).join(' ');
    if (level < 0 || level > 6) return player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Admin level must be 0-6!');
    db.query('UPDATE players SET admin = ? WHERE username = ?', [level, target.name], (err) => {
    if (err) return player.outputChatBox('!{FF0000}[ONY] !{FFFFFF}Mysql error!');
    player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}You gave ' + target.name + ' admin level ' + level + ' ' + ranks[level] + ' | Reason: ' + reason);
    target.outputChatBox('!{FFD700}[ONY] !{FFFFFF}You received admin level ' + level + ' ' + ranks[level] + ' by ' + player.name + ' | Reason: ' + reason);
    });
});


mp.events.addCommand('admins', (player) => {
    player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Online Admins:');
    mp.players.forEach((p) => {
        db.query('SELECT admin FROM players WHERE username = ?', [p.name], (err, results) => {
            if (results.length > 0 && results[0].admin > 0) {
                player.outputChatBox('!{FFD700}' + p.name + ' !{FFFFFF}- ' + ranks[results[0].admin] + ' (Level ' + results[0].admin + ')');
            }
        });
    });
});


mp.events.add('playerJoin', (player) => {
    player.call('freezePlayer', [true]);
    player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}You have 60 seconds to /login or /register!');
    setTimeout(() => {
        if (!loggedIn[player.name]) player.kick('!{FFD700}[ONY] !{FFFFFF}You did not login in time!');
    }, 60000);
});

mp.events.addCommand('veh', (player, name) => {
    if (!name) return player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Use: /veh [name]');
    db.query('SELECT admin FROM players WHERE username = ?', [player.name], (err, results) => {
    if (results[0].admin < 1) return player.outputChatBox('!{FF0000}[ONY] !{FFFFFF}You must be admin!');

    let vehicle = mp.vehicles.new(mp.joaat(name), player.position);
    player.putIntoVehicle(vehicle, 0);
    player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Vehicle ' + name + ' spawned!');
    });
});

mp.events.addCommand('noclip', (player) => {
    db.query('SELECT admin FROM players WHERE username = ?', [player.name], (err, results) => {
        if (results[0].admin < 1) return player.outputChatBox('!{FF0000}[ONY] !{FFFFFF}You must be admin!');
        player.call('toggleNoclip');
        player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Noclip toggled!');
    });
});

mp.events.addCommand('flip', (player) => {
    db.query('SELECT admin FROM players WHERE username = ?', [player.name], (err, results) => {
    if (results[0].admin < 1) return player.outputChatBox('!{FF0000}[ONY] !{FFFFFF}You must be admin!');
    if (!player.vehicle) return player.outputChatBox('!{FF0000}[ONY] !{FFFFFF}You must be in a vehicle!');
    let rot = player.vehicle.rotation;
    player.vehicle.rotation = new mp.Vector3(0, 0, rot.z);
    player.outputChatBox('!{FFD700}[ONY] !{FFFFFF}Vehicle flipped!');
    });
});