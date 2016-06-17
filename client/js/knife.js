var KNIFE_COLLISION_DISTANCE = 25;
var KNIFE_LENGTH = 21;

var Knife = function(x, y, angle, ability, ownerID) {
        var self = Entity();
	self.x = x;
	self.y = y;
	self.angle = angle;
        self.id = Math.random();
	self.duration = ability.duration;
	self.damage = ability.damage;
	self.ownerID = ownerID;
	self.canHarm = true;

        self.maxSpdX = Math.cos(angle/180*Math.PI) * ability.speed;
        self.maxSpdY = Math.sin(angle/180*Math.PI) * ability.speed * 1.3;

	self.knifeTipX = Math.floor(self.x + Math.cos(angle/180*Math.PI)*KNIFE_LENGTH);
	self.knifeTipY = Math.floor(self.y + Math.sin(angle/180*Math.PI)*KNIFE_LENGTH);
	
	self.spdX = 0;
	self.spdY = 0;

        self.timer = 0;
        self.toRemove = false;
        var super_update = self.update;
        self.update = function() {
                if(self.timer ++ > self.duration)
                        self.toRemove = true;
		var moveFactor = 1;
		if(self.maxSpdX > self.spdX || self.maxSpdX < self.spdX) {
			self.spdX = (self.maxSpdX*moveFactor + self.spdX)/(1+moveFactor);
		}
		if(self.maxSpdY > self.spdY || self.maxSpdY < self.spdY) {
			self.spdY = (self.maxSpdY*moveFactor + self.spdY)/(1+moveFactor);
		}
                super_update();
        }

	self.updateXY = function(x, y) {
		self.x = x;
		self.y = y;
	}

        self.getInitPack = function() {
                return {
                        id:self.id,
                        x:self.x,
                        y:self.y,
			angle:self.angle,
                };
        }

        self.getUpdatePack = function() {
                return {
                        id:self.id,
                        x:self.x,
                        y:self.y,
			angle:self.angle,
                };
        }

        Knife.list[self.ownerID] = self;
        initPack.knife.push(self.getInitPack());

        return self;
}
Knife.list = {};

Knife.update = function() {
        var pack = [];
        for(var i in Knife.list) {	
		var knife = Knife.list[i];		

                knife.update();
		for(var j in Player.list) {
			var player = Player.list[j];
			var x_dist = knife.knifeTipX - player.x;
			var y_dist = knife.knifeTipY - player.y;

			if(x_dist < 0) x_dist = -x_dist;
			if(y_dist < 0) y_dist = -y_dist;

			if(x_dist < KNIFE_COLLISION_DISTANCE && y_dist < KNIFE_COLLISION_DISTANCE && player.id !== knife.ownerID && knife.canHarm === true) {
				console.log("KNIFED");
				knife.canHarm = false;
				player.damage(knife.damage);
				break;
			}
		}  
	      if(knife.toRemove) {
			removePack.knife.push(knife.id);
			delete Knife.list[i];
                }
                else {
                        pack.push(knife.getUpdatePack());
		}
        }
        return pack;
}

Knife.getAllInitPack = function() {
        var knives = [];
        for(var i in Knife.list) {
                knives.push(Knife.list[i].getInitPack());
        }
        return knives;
}


