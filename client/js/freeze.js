var Freeze = function(ability, x, y, ownerID) {
        var self = Entity();
	self.x = x;
	self.y = y;
        self.id = Math.random();
	self.duration = ability.duration;
	self.radius = ability.radius;
	self.ownerID = ownerID;

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
			radius:self.radius,
                };
        }

        self.getUpdatePack = function() {
                return {
                        id:self.id,
                        x:self.x,
                        y:self.y,
			radius:self.radius,
                };
        }

	for(var i in Player.list) {
		var player = Player.list[i];
		var x_dist = player.x - self.x;
		var y_dist = player.y - self.y;
		var dist = Math.sqrt(x_dist*x_dist + y_dist*y_dist);
		if(dist < self.radius && player.id !== self.ownerID) {
			player.freeze(ability.duration);
		}
	}

	Freeze.list[self.id] = self;
	initPack.freeze.push(self.getInitPack());

        return self;
}
Freeze.list = {};

Freeze.update = function() {
	var pack = [];
	for(var i in Freeze.list) {
		var freeze = Freeze.list[i];
		freeze.update();

		if(freeze.toRemove) {
			delete Freeze.list[i];
			removePack.freeze.push(freeze.id);
		}
		else {
			pack.push(freeze.getUpdatePack());
		}
	}
	return pack;
}

Freeze.getAllInitPack = function() {
	var freezes = [];
	for(var i in Freeze.list) {
		freezes.push(Freeze.list[i].getInitPack());
	}
	return freezes;
}

