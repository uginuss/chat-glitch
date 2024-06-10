const fs=require('fs');
const crypto=require('crypto');
const dbfile='./chat.db';
const exist=fs.existsSync(dbfile);
const sqlite3=require('sqlite3').verbose();
const dbwrapper=require('sqlite');
let db;

dbwrapper.open({
    filename: dbfile,
    driver: sqlite3.Database

}).then(async dbase=>{
    db=dbase
    try{
        if(!exist){
            await db.run(
                'create table user(user_id integer primary key autoincrement, login text, password text);'
            );
            await db.run(
                `insert into user(login, password) values('admin', 'admin'), ('ugin', 'ugin'), ('Dima', '1234'), ('dimitar', '1234'), ('dMytro', '1234');`
            );
            await db.run(
                `CREATE TABLE message(
                    msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT,
                    author_id INTEGER,
                    FOREIGN KEY(author_id) REFERENCES user(user_id)
                );`
            );
        }else{
            console.log(await db.all('select * from user'));
            console.log(await db.all('select * from message'));
        };

    }catch(error){
        console.error(error);
    }
})


module.exports={
    getmessages: async()=>{
        try{
            return await db.all(
                `select msg_id, content, login, user_id from message join user on message.author_id=user.user_id`
            );
        } catch(error){
            console.error(error);
        }
    },

    addmessage: async(msg, userid)=>{
        await db.run(
            `insert into message(content, author_id) values(?, ?)`, [msg, userid]
        );
    },


    isuserexist: async(login)=>{
        const candidate=await db.all(`SELECT * FROM user WHERE login = ?`, [login]);
        return !!candidate.length;
    },
    adduser: async(user)=>{
        await db.run(`insert into user(login, password) values (?, ?)`, [user.login, user.pass]);
    },


    getauthtoken: async(user)=>{
        const candidate=await db.all(`SELECT * FROM USER WHERE login = ?`, [user.login]);

        if(!candidate.length){
            throw 'Wrong login';
        }

        if(candidate[0].pass!==user.password){
            throw 'Wrong password';
        }

        return candidate[0].user_id+'.'+candidate[0].login+'.'+crypto.randomBytes(20).toString('hex');

    }



};