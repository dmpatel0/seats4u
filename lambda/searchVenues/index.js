const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    let searchVenues = (venueName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT Venues.venueName FROM Venues WHERE venueName LIKE CONCAT(? , '%') ", [venueName], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length > 0)) {
                    return resolve(rows); 
                } else {
                    return resolve("No venues Match");
                }
            });
        });
    }

    let response = undefined;
    try{
        const result = await searchVenues(event.venueName);

        response = {
            statusCode : 200,

            venues : result
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