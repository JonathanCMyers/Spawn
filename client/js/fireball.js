var FIREBALL_COLLISION_DISTANCE = 16;

var Fireball = function(x, y, angle, speed, duration, damage, ownerID) {
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
		for(var j in Player.list) {
			var player = Player.list[j];
			var x_dist = fireball.x - player.x;
			var y_dist = fireball.y - player.y;

			if(x_dist < 0) x_dist = -x_dist;
			if(y_dist < 0) y_dist = -y_dist;

			if(x_dist < FIREBALL_COLLISION_DISTANCE && y_dist < FIREBALL_COLLISION_DISTANCE && player.id !== fireball.ownerID) {
				fireball.toRemove = true;
				player.damage(fireball.damage);
				break;
			}
		}  
	      if(fireball.toRemove) {
			removePack.fireball.push(fireball.id);
			delete Fireball.list[i];
                }
                else {
                        pack.push(fireball.getUpdatePack());
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
