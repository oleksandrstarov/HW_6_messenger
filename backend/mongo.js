//set up  echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
var dbClient = require('mongodb').MongoClient,
    assert = require('assert');


/*MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: Nvl82yPe3lgr
   Database Name: messenger

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/*/


   
var url = 'mongodb://localhost:27017/messenger';

process.env.OPENSHIFT_MONGODB_DB_URL

if(process.env.OPENSHIFT_MONGODB_DB_URL){
    url = process.env.OPENSHIFT_MONGODB_DB_URL + 'messenger';
}
/*if(process.env.OPENSHIFT_MONGODB_DB_HOST && process.env.OPENSHIFT_MONGODB_DB_PORT){
   url = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/messenger';
}*/

console.log('url ' +url);
//messages({room:room, messages:[{user:user, message:message},{...}]})





module.exports.findMessages = function(room, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        if(!room){
            room = 'main';
        }
        
        var param = {room:room};
        var collection = db.collection('messages');
        collection.find(param).toArray(function(error, docs){
            assert.equal(error, null);
            callback(docs);
            db.close();
        });
    });
};


module.exports.saveMessage = function(document, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        var room = document.room;
        var message = document.message;
        var user = document.user;
        
        findUser(user, function(isExists){
            if(!isExists){
                db.close();
                callback('error, user not found');
                return;
            }
            
            if(!room){
                room = 'main';
            }
            
            var collection = db.collection('messages');
            //console.log(collection);
            
            
            collection.update({room:room}, {
                '$push':{
                    messages: {user:user, message:message, date: new Date()}
                }},{upsert: true}, function(error, count){
                    console.log(error);
                    assert.equal(error, null);
                    
                    db.close();
                    callback(count);
            });
            
        });
        
    });
};


module.exports.checkLogin = function(userData, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        var userName = userData.userName;
        var password = userData.password;
        
        var collection = db.collection('users');
        var param = {
            userName: userName,
            password: password
        };
        
        collection.find(param).toArray(function(error, docs){
            assert.equal(error, null);
            if(docs.length > 0){
                callback({response: 'success', userName: userName});
            }else{
                callback({response: 'fail', event: 'login'});
            }
            db.close();
        });
    });
};

module.exports.registerUser = function(userData, callback){
    findUser(userData.userName, function(isExists){
        if(isExists){
            callback({response: 'fail',  event: 'registration'});
            return;
        }
        dbClient.connect(url, function(error, db){
            assert.equal(error, null);
            var userName = userData.userName;
            var password = userData.password;
            
            var param = {
                userName: userName,
                password: password
            };
            
            var collection = db.collection('users');
            collection.insertOne(param, function(error, result){
                assert.equal(error, null);
                console.log(result);
                callback({response: 'success', userName: userName});
                db.close();
            });
        });
    });
};


var findUser = function(userName, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        
        var param = {
            userName: userName
        };
        
        var collection = db.collection('users');
        collection.find(param).toArray(function(error, docs){
            assert.equal(error, null);
            var isExists = false;
            if(docs.length > 0){
                isExists = true;
            }
            callback(isExists);
            db.close();
        });
    });
};
