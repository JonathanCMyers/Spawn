var Player_Default_Max_Speed = 8;
var Player_Dash_Speed = 55;
var Player_Speed_Boost_Speed = 13;
var Player_Respawn_Timer = 5*25;

var Player = function(id, user_name) {
        var self = Entity();
        self.id = id;
        //self.number = "" + Math.floor(10*Math.random());
        self.number = user_name;
        self.pressingRight = false;
        self.pressingLeft = false;
        self.pressingUp = false;
        self.pressingDown = false;
	self.directionFacing = 3;
        self.maxSpd = Player_Default_Max_Speed;
        self.canMove = true;
	self.canChangeDirection = true;
	self.hp = 100;
        self.hpMax = 100;
        self.score = 0;
	self.canMove = true;

	self.abilities = {};
	self.cooldowns = {};
	self.activeAbilities = {};
	self.shields = {};
	self.bigShieldID = -1;
	self.smallShieldID = -1;
	self.shieldHP = 0;

	self.respawning = false;
	self.respawnTimer = 0;

        var super_update = self.update;
        self.update = function() {
		self.checkRespawn();
		if(!self.respawning) {
                	self.updateSpd();
			self.updateAbilities();
			super_update();
		}
        }

	self.updateAbilities = function() {
		self.updateAbilityDurations();
		self.updateAbilityCooldowns();
		self.checkRemoveAbilityEffects();
		
	}

	self.updateAbilityDurations = function() {
		for(var i in self.abilities) {
			if(self.abilities[i].currentDuration > 0) {
				self.abilities[i].currentDuration--;
				if(self.abilities[i].currentDuration === 0) {
					self.abilities[i].toRemove = true;
				}
			}
		}
	}

	self.updateAbilityCooldowns = function() {
		for(var i in self.cooldowns) {
			if(self.cooldowns[i] > 0)
				self.cooldowns[i]--;
		}
	}

	self.checkRemoveAbilityEffects = function() {
		for(var i in self.abilities) {
			if(self.abilities[i].toRemove === true) {
				self.abilities[i].toRemove = false;
				if(self.abilities[i].name === 'dash') {
					self.canChangeDirection = true;
					self.maxSpd = Player_Default_Max_Speed;
				}
				if(self.abilities[i].name === 'speed') {
					self.maxSpd = Player_Default_Max_Speed;
				}
				if(self.abilities[i].name === 'bigShield') {
					if(self.shieldHP <= 0) console.log("SHIELD ERROR!");
					self.shieldHP = self.shieldHP - self.shields[self.bigShieldID].hp;
					delete self.shields[self.bigShieldID];
					self.bigShieldID = -1;
					console.log("Shield removed. " + self.shieldHP);
				}
				if(self.abilities[i].name === 'smallShield') {
					if(self.shieldHP <= 0) console.log("SHIELD ERROR!");
					self.shieldHP = self.shieldHP - self.shields[self.smallShieldID].hp;
					delete self.shields[self.smallShieldID];
					self.smallShieldID = -1;
				}
				if(self.abilities[i].name === 'fireball') {
					
				}
				if(self.abilities[i].name === 'freeze') {
					
				}
				if(self.abilities[i].name === 'stealth') {
					
				}
				if(self.abilities[i].name === 'bolts') {
					
				}
			}
		}
	}

        self.updateSpd = function() {
                if(self.pressingRight && self.x < WIDTH)
			self.spdX = self.maxSpd;
                else if(self.pressingLeft && self.x > 0)
                        self.spdX = -self.maxSpd;
                else
                        self.spdX = 0;

                if(self.pressingUp && self.y > 0)
                        self.spdY = -self.maxSpd;
                else if(self.pressingDown && self.y < HEIGHT)
                        self.spdY = self.maxSpd;
                else
                        self.spdY = 0;
        }
        self.getInitPack = function() {
		return {
                        id:self.id,
                        x:self.x,
                        y:self.y,
                        number:self.number,
                        hp:self.hp,
                        hpMax:self.hpMax,
                        score:self.score,
			directionFacing:self.directionFacing,
			shieldHP:self.shieldHP,
			respawning:self.respawning,
                };
        }

        self.getUpdatePack = function() {
                return {
                        id:self.id,
                        x:self.x,
                        y:self.y,
                        hp:self.hp,
                        score:self.score,
			directionFacing:self.directionFacing,
			shieldHP:self.shieldHP,
                	respawning:self.respawning,
		}
        }

	self.checkAvailableAbilities = function(keyValue) {
		if(self.abilities[keyValue] && self.cooldowns[keyValue] === 0) {
			if(self.cooldowns[keyValue] === 0)
				return 1; // can use ability
			else
				return 2; // play cooldown noise
		}
		else
			return 3;
	}

	self.useAbility = function(keyValue) {
		if(self.abilities[keyValue].name === 'dash') {
			// make it so that the player can't change direction mid-dash
				// create a counter for the duration of dash to make this
			// 
			self.abilities[keyValue].currentDuration = self.abilities[keyValue].duration;
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
			self.canChangeDirection = false;
                        self.maxSpd = Player_Dash_Speed;
		}
		if(self.abilities[keyValue].name === 'speed') {
			// increase the player's max x and y speed for the duration
			self.abilities[keyValue].currentDuration = self.abilities[keyValue].duration;
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
              		self.maxSpd = Player_Speed_Boost_Speed;
		}
		if(self.abilities[keyValue].name === 'bigShield') {
			// attach a large shield object onto the player for the duration
			self.abilities[keyValue].currentDuration = self.abilities[keyValue].duration;
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
			self.bigShieldID = 1;
			var hp = self.abilities[keyValue].hp;
			var duration = self.abilities[keyValue].duration;
			self.shields[self.bigShieldID] = Shield(hp, duration, self.x, self.y, true);
			self.shieldHP = self.shieldHP + hp;
			console.log("Shield Created");
		}
		if(self.abilities[keyValue].name === 'smallShield') {
			// attach a small shield object onto the player for the duration
			self.abilities[keyValue].currentDuration = self.abilities[keyValue].duration;
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
			self.smallShieldID = 2;
			var hp = self.abilities[keyValue].hp;
			var duration = self.abilities[keyValue].duration;
			self.shields[self.smallShieldID] = Shield(hp, duration, self.x, self.y, false);
			self.shieldHP = self.shieldHP + hp;
		}
		if(self.abilities[keyValue].name === 'fireball') {
			// spit out a fireball in the direction the player is facing
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
			// determine the angle the fireball will be shot out at
			var degrees = 90*(self.directionFacing+2);
			var speed = self.abilities[keyValue].speed;
			var duration = self.abilities[keyValue].duration;
			var damage = self.abilities[keyValue].damage;
			var fireball = Fireball(self.x, self.y, degrees, speed, duration, damage, self.id);
			console.log("Fireball created");
		}
		if(self.abilities[keyValue].name === 'freeze') {
			// spawn a freeze object centered where the player is for the duration
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
		}
		if(self.abilities[keyValue].name === 'stealth') {
			// NOT SURE HOW TO DO THIS AT THE MOMENT
			// potentially make a visibility boolean on the player?
			// and for a brief period have the player flicker out before entering stealth
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
		}
		if(self.abilities[keyValue].name === 'bolts') {
			// spawn 12(?) bolt objects around the player
			self.cooldowns[keyValue] = self.abilities[keyValue].cooldown;
		}
		
	}

	self.giveRandomAbility = function() {
		// binds random ability to 'q'
		var abilityCount = 5;
		console.log("ability given:");
		var r = Math.floor(Math.random()*abilityCount+1);
		r = 5;
		if(r === 1) {
			self.abilities[81] = Ability('dash',1);
			self.cooldowns[81] = 0;
			console.log("dash");
		}
		else if(r === 2) {
			self.abilities[81] = Ability('speed',1);
			self.cooldowns[81] = 0;
			console.log("speed");
		}
		else if(r === 3) {
		    	self.abilities[81] = Ability('bigShield',1);
                	self.cooldowns[81] = 0;
			console.log("bigShield");
		}
		else if(r === 4) {
			self.abilities[81] = Ability('smallShield',1);
                	self.cooldowns[81] = 0;
			console.log("smallShield");
		}
		else if(r === 5) {
			self.abilities[81] = Ability('fireball',1);
                	self.cooldowns[81] = 0;
			console.log("fireball");
		}
		else if(r === 6) {
			self.abilities[81] = Ability('freeze',1);
			self.cooldowns[81] = 0;
			console.log("freeze");
		}
                else if(r === 7) {
			self.abilities[81] = Ability('stealth',1);
			self.cooldowns[81] = 0;
			console.log("stealth");
		}
                else if(r === 8) {
			self.abilities[81] = Ability('bolts',1);
			self.cooldowns[81] = 0;
			console.log("bolts");
		}

		self.abilities[32] = Ability('knife',1);
		self.cooldowns[32] = 0;
	}
	
	self.getAbilities = function() {
		
	}

	self.damage = function(hp) {

		// NOTE: When messing with damage, remove hp from the shields first before payer hp
	
		/*
		self.hp = self.hp - hp;
		if(self.hp <= 0) {
			
		}
		*/
		self.hp = self.hp - hp;

		if(self.hp <= 0) {
			self.respawning = true;
			self.respawnTimer = Player_Respawn_Timer;
		}

	}

	self.checkRespawn = function() {
		if(self.respawning) {
			self.respawnTimer--;
			if(self.respawnTimer === 0) {
				self.respawning = false;
				self.x = Math.floor(Math.random()*400);
				self.y = Math.floor(Math.random()*400);
			}
		}
	}

        Player.list[id] = self;
        initPack.player.push(self.getInitPack());

        return self;

}
Player.list = {};

Player.onConnect = function(socket, user_name) {
        var player = Player(socket.id, user_name);
	player.giveRandomAbility();
        socket.on('keyPress',function(data){
	        if(data.inputId === 'left') {
       	               	player.pressingLeft = data.state;
			if(data.state)	player.directionFacing = 4;
		}
       	        else if(data.inputId === 'right') {
       	               	player.pressingRight = data.state;
			if(data.state) player.directionFacing = 2;
		}
       	        else if(data.inputId === 'up') {
                       	player.pressingUp = data.state;
			if(data.state) player.directionFacing = 1;
		}
                else if(data.inputId === 'down') {
                       	player.pressingDown = data.state;
			if(data.state) player.directionFacing = 3;
		}
		if(player.checkAvailableAbilities(data.inputId) === 1) {
			player.useAbility(data.inputId);
		}
		else if(player.checkAvailableAbilities(data.inputId) === 2) {
			// play cooldown noise
		}
		if(data.inputId === 'tab') {
			// open menu
		}
        });

        socket.emit('init', {
                selfId:socket.id,
                player:Player.getAllInitPack(),
                bullet:Bullet.getAllInitPack(),
		fireball:Fireball.getAllInitPack(),
        });
}
Player.getAllInitPack = function() {
        var players = [];
        for(var i in Player.list) {
                players.push(Player.list[i].getInitPack());
        }
        return players;
}

Player.onDisconnect = function(socket) {
        delete Player.list[socket.id];
        removePack.player.push(socket.id);
}

Player.update = function() {
        var pack = [];
        for(var i in Player.list) {
                var player = Player.list[i];
                player.update();
                pack.push(player.getUpdatePack());
        }
        return pack;
}


