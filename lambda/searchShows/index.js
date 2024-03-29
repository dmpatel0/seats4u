const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    let searchVenues = (showName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT Shows.venueName, Shows.showName, Shows.showTime FROM Shows WHERE Shows.showName LIKE CONCAT(? , '%') ", [showName], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length > 0)) {
                    return resolve(rows); 
                } else {
                    return resolve("No shows Match");
                }
            });
        });
    }

    let response = undefined;
    try{
        const result = await searchVenues(event.showName);

        response = {
            statusCode : 200,

            shows : result
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