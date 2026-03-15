mp.events.add('freezePlayer', (toggle) => {
    mp.players.local.freezePosition(toggle);
});

let noclipActive = false;
let noclipCamera = null;

mp.events.add('toggleNoclip', () => {
    noclipActive = !noclipActive;
    mp.players.local.freezePosition(noclipActive);
    mp.players.local.setInvincible(noclipActive);
    mp.players.local.setVisible(!noclipActive, false);
    mp.players.local.setCollision(!noclipActive, false);
});

mp.events.add('render', () => {
    if (!noclipActive) return;
    let speed = 1.0;
    let pos = mp.players.local.position;
    let rot = mp.game.cam.getGameplayCamRot(2);

    if (mp.keys.isDown(0x57)) { 
        pos.x += speed * Math.sin(rot.z * Math.PI / 180) * -1;
        pos.y += speed * Math.cos(rot.z * Math.PI / 180);
    }
    if (mp.keys.isDown(0x53)) { 
        pos.x -= speed * Math.sin(rot.z * Math.PI / 180) * -1;
        pos.y -= speed * Math.cos(rot.z * Math.PI / 180);
    }
    if (mp.keys.isDown(0x41)) {
        pos.x += speed * Math.cos(rot.z * Math.PI / 180);
        pos.y += speed * Math.sin(rot.z * Math.PI / 180);
    }
    if (mp.keys.isDown(0x44)) { 
        pos.x -= speed * Math.cos(rot.z * Math.PI / 180);
        pos.y -= speed * Math.sin(rot.z * Math.PI / 180);
    }
    if (mp.keys.isDown(0x20)) { 
        pos.z += speed;
    }
    if (mp.keys.isDown(0x10)) {
        pos.z -= speed;
    }

    mp.players.local.position = pos;
});
