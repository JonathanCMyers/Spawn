// later at some point just add currentCooldown and get rid of the
// cooldowns arraylist

var Ability = function(name, level) {
	self = {
		name:name,
		level:level,
		cooldown:0,
		radius:0,
		hp:0,
		damage:0,
		distance:0,
		duration:0,
		currentDuration:0,
		toRemove:false,
	}
	if(self.name === 'knife') {
		self.cooldown = 1*25;
		self.duration = .25*25;
	}
	if(self.name === 'dash') {
		self.cooldown = 4*25;
		self.duration = 25/5;
		//currentDuration = 0;
	}
	if(self.name === 'speed') {
	        self.cooldown = 6*25;
		self.duration = 3*25;
		//currentDuration = 0;
	}
	if(self.name === 'bigShield') {
	        self.cooldown = 6*25;	
		self.duration = 2*25;
		self.hp = 30;
	}
	if(self.name === 'smallShield') {
	        self.cooldown = 3*25;
		self.duration = Math.floor(.75*25);
		self.hp = 10;
	}
	if(self.name === 'fireball') {
	        self.cooldown = 3*25;
		self.duration = 2*25;
		self.speed = 13 + ((level-1)*6);
		self.damage = 25 + ((level-1)*5);
	}
	if(self.name === 'freeze') {
	        self.cooldown = 6;
	}
	if(self.name === 'stealth') {
	        self.cooldown = 10*25;
		self.duration = 8*25;
	}
	if(self.name === 'bolts') {
	       	self.cooldown = 3*25;
		self.duration = Math.floor(.27*25);
		self.speed = 16;
		self.damage = 20 + ((level-1)*5);
	}
	if(self.name === 'flicker') {
		self.cooldown = 0;
		self.duration = Math.floor(level*25);
	}
	return self;
}



