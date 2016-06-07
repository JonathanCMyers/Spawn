// the ID is the same as the player
// so the client will know who the shield is attached to
// this is important so the client knows when your shield is on

var BigShield = function(hp, duration, x, y, id) {
	self = {
		hp:hp,
		duration:duration,
		timer:0,
		toRemove:false,
		x:x,
		y:y,
		id:id,
	}
	self.update = function(x, y) {
		self.x = x;
		self.y = y;
		if(self.timer++ > self.duration) {
			self.toRemove = true;
		}
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
	
	BigShield.list[self.id] = self;
	initPack.bigshield.push(self.getInitPack());

	return self;

}
BigShield.list = {};

