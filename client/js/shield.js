// the ID is the same as the player
// so the client will know who the shield is attached to
// this is important so the client knows when your shield is on

// The shield objects do not have to be transmitted to the client like
// normal objects do. The shield can just be an attribute of the player.
// It will only be sent if one is active as part of the player init/update/remove packs.

var Shield = function(hp, duration, x, y, bigSize) {
	self = {
		hp:hp,
		duration:duration,
		timer:0,
		toRemove:false,
		x:x,
		y:y,
		bigSize:bigSize,
	}
	self.update = function(x, y) {
		if(self.timer++ > self.duration) {
			self.toRemove = true;
		}
	}
	return self;
}

