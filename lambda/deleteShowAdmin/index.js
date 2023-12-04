const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    let checkExists = (venueName, showName, showTime) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Shows WHERE venueName=? AND showName=? AND showTime=?", [venueName, showName, showTime], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    return resolve(true)
                } else {
                    return reject("Show not found");
                }
            });
        });
    }

    let response = undefined;
    try{
        let showExists = await checkExists(event.venueName, event.showName, event.showTime);

        if(showExists){
            let deleteShow = (venueName, showName, showTime) => {
                return new Promise((resolve, reject) => {
                    pool.query("DELETE FROM Shows WHERE venueName=? AND showName=? AND showTime=?", [venueName, showName, showTime], (error, rows) => {
                        if (error) { return reject(error); }
                        console.log(rows)
                        if ((rows) && (rows.affectedRows == 1)) {
                            return resolve(true); 
                        } else {
                            return resolve(false);
                        }
                    });
                });
            }
        
            try{
                const result = await deleteShow(event.venueName, event.showName, event.showTime);
                if(!result){
                    response = {
                        statusCode: 400,
                        
                        error: "No rows affected"
                    }
                }else{
                    response = {
                        statusCode : 200,
    
                        venueName : event.venueName,
    
                        showName : event.showName,
    
                        showTime : event.showTime
                    }
                } 
            }catch(err){
                response = {
                    statusCode : 400,
        
                    error : err
                }
            }
        }

    }catch(err){
        response = {
            statusCode : 400,

            error : err
        }
    }finally{
        pool.end()
    }

    return response
}