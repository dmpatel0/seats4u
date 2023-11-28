const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    let getPassword = (venueName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT Venues.venuePassword FROM Venues WHERE venueName=?", [venueName], (error, rows) => {
                if (error) { return reject(error); }
                console.log(rows)
                if ((rows) && (rows.length == 1)) {
                    return resolve(rows[0].venuePassword); 
                } else {
                    return resolve(false);
                }
            });
        });
    }

    let response = undefined;
    try{
        const result = await getPassword(event.venueName);

        response = {
            statusCode : 200,

            password : result
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