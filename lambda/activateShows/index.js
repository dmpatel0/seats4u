const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    let checkActive = (venueName, showName, showTime) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT Shows.isActive FROM Shows WHERE venueName=? AND showName=? AND showTime=?", [venueName, showName, showTime], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    if(rows[0].isActive === 1){
                        return resolve(true); 
                    }
                    else{
                        return resolve(false);
                    }
                } else {
                    return reject("Show not found");
                }
            });
        });
    }

    let response = undefined;
    try{
        let showActive = await checkActive(event.venueName, event.showName, event.showTime);

        if(!showActive){
            let activateShows = (venueName, showName, showTime) => {
                return new Promise((resolve, reject) => {
                    pool.query("UPDATE Shows SET isActive = 1 WHERE venueName=? AND showName=? AND showTime=?", [venueName, showName, showTime], (error, rows) => {
                        if (error) { return reject(error); }
                        console.log(rows)
                        if ((rows) && (rows.length == 1)) {
                            return resolve(true); 
                        } else {
                            return resolve(false);
                        }
                    });
                });
            }
        
            try{
                const result = await activateShows(event.venueName, event.showName, event.showTime);
        
                response = {
                    statusCode : 200,

                    venueName : event.venueName,

                    showName : event.showName,

                    showTime : event.showTime,
        
                    password : result
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