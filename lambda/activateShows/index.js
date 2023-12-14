const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    let checkActive = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT Shows.isActive FROM Shows WHERE showID = ? AND showTime >= CURRENT_TIMESTAMP", [showID], (error, rows) => {
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
        let showActive = await checkActive(event.showID);

        if(!showActive){
            let activateShows = (showID) => {
                return new Promise((resolve, reject) => {
                    pool.query("UPDATE Shows SET isActive = 1 WHERE showID = ?", [showID], (error, rows) => {
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
                const result = await activateShows(event.showID);
        
                response = {
                    statusCode : 200,

                    showID : event.showID,
        
                    success : result
                }
            }catch(err){
                response = {
                    statusCode : 400,
        
                    error : JSON.stringify(err)
                }
            }
        }else{
            response = {
                statusCode : 404,
        
                error : "Show is already active"
            }
        }

    }catch(err){
        response = {
            statusCode : 400,

            error : JSON.stringify(err)
        }
    }finally{
        pool.end()
    }

    return response
}