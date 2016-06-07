var isValidPassword = function(data, cb) {
        db.account.find({username:data.username, password:data.password},function(err, res) {
                if(res.length > 0) {
                        cb(true);
                }
                else {
                        cb(false);
                }

        });
}

var isUsernameTaken = function(data, cb) {
        db.account.find({username:data.username}, function(err, res) {
                if(res.length > 0) {
                        cb(true);
                }
                else {
                        cb(false);
                }
        });
}

var addUser = function(data, cb) {
        db.account.insert({username:data.username, password:data.password}, function(err) {
                cb();
        });
}

