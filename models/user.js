var mongodb=require('./db');

function User(user){
    this.name=user.name;
    this.password=user.password;
};
module.exports=User;
User.prototype.save=function save(callback){
    var user={
        name:this.name,
        password:this.password
    };
    mongodb.open(function(err,db){
            if(err){
                return callback(err);
            }
            //读取集合
            db.collection('users',function(err,collection){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                //添加索引
                collection.ensureIndex('name',{unique:true});
                //写入文档
                collection.insert(user,{safe:true},function(err,user){
                    mongodb.close();
                    callback(err);
                });
            });

        });
};
User.get= function get(username,callback) {
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找
            collection.findOne({name:username}, function(err,doc) {
                mongodb.close();
                if(doc){
                    var user=new User(doc);
                    callback(err,user);
                }else{
                    callback(err,null);
                }
            });
        })
    })
}