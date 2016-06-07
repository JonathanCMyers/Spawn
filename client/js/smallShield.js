/*
var Ability = function() {
	//var options = {'dash', 'speed', 'bigShield', 'smallShield', 'fireball',
	//	'freeze', 'stealth', 'bolts'};
	//var options = [];
	
        var abilityCount = 1;
	var maxLevel = 3;

	var self = {
		dash:0,
		speed:0,
		bigShield:0,
		smallShield:0,
		fireball:0,
		freeze:0,
		stealth:0,
		bolts:0,
        }
	self.addRandomAbility() {
		var r = Math.floor(Math.random()*abilityCount+1);
		if(r === 1)	self.dash++;
		if(r === 2)	self.speed++;
		if(r === 3)	self.bigShield++;
		if(r === 4)	self.smallShield++;
		if(r === 5)	self.fireball++;
		if(r === 6)	self.freeze++;
		if(r === 7)	self.stealth++;
		if(r === 8)	self.bolts++;
	}
	self.incrementAbility(a) {
		self.dash += a.dash;
		if(self.dash > maxLevel)
			self.dash = maxLevel;
		console.log("New dash level: " + self.dash);

		if(a === 'dash' && self.dash < maxLevel) {
			self.dash = self.dash + a.dash;
			console.log('dash incremented');
		}
		if(a === 'speed' && self.speed < maxLevel)
			self.speed++;
		if(a === 'bigShield' && self.bigShield < maxLevel)
			self.bigShield++;
		if(a === 'smallShield' && self.smallShield < maxLevel)
			self.smallShield++;
		if(a === 'fireball' && self.fireball < maxLevel)
			self.fireball++;
		if(a === 'freeze' && self.freeze < maxLevel)
			self.freeze++;
		if(a === 'stealth' && self.stealth < maxLevel)
			self.stealth++;
		if(a === 'bolts' && self.bolts < maxLevel)
			self.bolts++;

	}

	return self;
}
*/

var Ability = function(name, level) {
	self = {
		name:name,
		level:level,
		cooldown:0,
		radius:0,
		hp:0,
		distance:0,
		duration:0,
	}
	if(self.name === 'dash') {
		self.cooldown = 6;
	}
	if(self.name === 'speed') {
	        self.cooldown = 6;
	}
	if(self.name === 'bigShield') {
	        self.cooldown = 6;	
	}
	if(self.name === 'smallShield') {
	        self.cooldown = 6;
	}
	if(self.name === 'fireball') {
	        self.cooldown = 6;
	}
	if(self.name === 'freeze') {
	        self.cooldown = 6;
	}
	if(self.name === 'stealth') {
	        self.cooldown = 6;
	}
	if(self.name === 'bolts') {
	       self.cooldown = 6;
	}


}











