var BOLT_COLLISION_DISTANCE = 16;

var Bolt = function(x, y, angle, speed, duration, damage, ownerID) {
        var self = Entity();
	self.x = x;
	self.y = y;
        self.id = Math.random();
	self.duration = duration;
	self.damage = damage;
	self.ownerID = ownerID;

        self.spdX = Math.cos(angle/180*Math.PI) * speed;
        self.spdY = Math.sin(angle/180*Math.PI) * speed;

        self.timer = 0;
        self.toRemove = false;
        var super_update = self.update;
        self.update = function() {
                if(self.timer ++ > self.duration)
                        self.toRemove = true;
                super_update();
        }

        self.getInitPack = function() {
                return {
                        id:self.id,
                        x:self.x,
                        y:self.y,
                };
        }

        self.getUpdatePack = function() {
                return {
                        id:self.id,
                        x:self.x,
                        y:self.y,
                };
        }

        Fireball.list[self.id] = self;
        initPack.fireball.push(self.getInitPack());

        return self;
}
Fireball.list = {};

Fireball.update = function() {
        var pack = [];
        for(var i in Fireball.list) {
                var fireball = Fireball.list[i];
                fireball.update();
	/*	for(var i in Player.list) {
			var player = Player.list[i];
			if(fireball.x - player.x < FIREBALL_COLLISION_DISTANCE && fireball.y - player.y < FIREBALL_COLLISION_DISTANCE && player.id !== fireball.ownerID) {
				fireball.toRemove = true;
				player.damage(fireball.damage);
				break;
			}
		}
        */  
	      if(fireball.toRemove) {
                        delete Fireball.list[i];
                        removePack.fireball.push(fireball.id);
			console.log("Fireball REMOVED!");
                }
                else {
                        pack.push(fireball.getUpdatePack());
			console.log("( " + fireball.x + ", " + fireball.y + ")");
		}
        }
        return pack;
}

Fireball.getAllInitPack = function() {
        var fireballs = [];
        for(var i in Fireball.list) {
                fireballs.push(Fireball.list[i].getInitPack());
        }
        return fireballs;
}
