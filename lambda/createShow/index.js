const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });



    let validateExists = (showName, venueName, showTime) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Shows WHERE (showName=? AND venueName=? AND showTime=?)", [showName, venueName, showTime], (error, rows) => {
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

    let response = undefined
    try{
        const can_create = await validateExists(event.showName, event.venueName, event.showTime);
    
    

        if(!can_create){
            let createShow = (showName, venueName, showTime, price) => {
                return new Promise((resolve, reject) => {
                    pool.query("INSERT into Shows(venueName,showName,showTime,singlePrice,isActive) VALUES(?,?,?,?,0);", [venueName,showName, showTime, price], (error, rows) => {
                        if (error) { return reject(error); }
                        if ((rows) && (rows.affectedRows == 1)) {
                            return resolve(true);
                        } else {
                            return resolve(false);
                        }
                    });
                });
            }   
            try{
                let addresult = await createShow(event.showName, event.venueName, event.showTime, event.price);

                response = {
                    statusCode: 200,
                    venueName: event.venueName,
                    showName: event.showName,
                    showTime: event.showTime
                }
            }catch(err){
                response = {
                    statusCode : 400,
        
                    error : err
                }
            }
            
        }else{
            response = {
                statusCode : 400,

                success: false
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
    return response;
}