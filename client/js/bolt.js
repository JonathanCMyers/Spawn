var BOLT_COLLISION_DISTANCE = 16;

//var Bolt = function(x, y, angle, speed, duration, damage, ownerID) {
var Bolt = function(ability, x, y, angle, ownerID) {
        var self = Entity();
	self.x = x;
	self.y = y;
        self.id = Math.random();
	self.duration = ability.duration;
	self.damage = ability.damage;
	self.ownerID = ownerID;

        self.spdX = Math.cos(angle/180*Math.PI) * ability.speed;
        self.spdY = Math.sin(angle/180*Math.PI) * ability.speed;

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

	Bolt.list[self.id] = self;
	initPack.bolt.push(self.getInitPack());

        return self;
}
Bolt.list = {};

Bolt.update = function() {
	var pack = [];
	for(var i in Bolt.list) {
		var bolt = Bolt.list[i];
		bolt.update();

		for(var j in Player.list) {
			var player = Player.list[j];
			var x_dist = bolt.x - player.x;
			var y_dist = bolt.y - player.y;
			
			if(x_dist < 0) x_dist = -x_dist;
			if(y_dist < 0) y_dist = -y_dist;
			
			if(x_dist < BOLT_COLLISION_DISTANCE && y_dist < BOLT_COLLISION_DISTANCE && player.id !== bolt.ownerID) {
				bolt.toRemove = true;
				player.damage(bolt.damage);
				break;
			}
		}

		if(bolt.toRemove) {
			delete Bolt.list[i];
			removePack.bolt.push(bolt.id);
		}
		else {
			pack.push(bolt.getUpdatePack());
		}
	}
	return pack;
}

Bolt.getAllInitPack = function() {
	var bolts = [];
	for(var i in Bolt.list) {
		bolts.push(Bolt.list[i].getInitPack());
	}
	return bolts;
}

