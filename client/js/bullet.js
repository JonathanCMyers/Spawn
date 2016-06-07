var Bullet = function(angle) {
        var self = Entity();
        self.id = Math.random();
        self.spdX = Math.cos(angle/180*Math.PI) * 10;
        self.spdY = Math.sin(angle/180*Math.PI) * 10;

        self.timer = 0;
        self.toRemove = false;
        var super_update = self.update;
        self.update = function() {
                if(self.timer ++ > 100)
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

        Bullet.list[self.id] = self;
        initPack.bullet.push(self.getInitPack());

        return self;
}
Bullet.list = {};


Bullet.update = function() {
/*        if(Math.random() < .1) {
                Bullet(Math.random() *360);
        }
*/
        var pack = [];
        for(var i in Bullet.list) {
                var bullet = Bullet.list[i];
                bullet.update();
                if(bullet.toRemove) {
                        delete Bullet.list[i];
                        removePack.bullet.push(bullet.id);
                }
                else
                        pack.push(bullet.getUpdatePack());
        }
        return pack;
}

Bullet.getAllInitPack = function() {
        var bullets = [];
        for(var i in Bullet.list) {
                bullets.push(Bullet.list[i].getInitPack());
        }
        return bullets;
}
