const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });

  let validateVenue = (venueName) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Shows WHERE venueName=? AND isActive = 1", [venueName], (error, rows) => {
            if (error) { return reject(error); }
            if ((rows) && (rows.length >= 1)) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        });
    });
   }

  let DeleteVenue = (venueName) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Venues WHERE venueName=?", [venueName], (error, rows) => {
            if (error) { return reject(error); }
            if ((rows) && (rows.affectedRows == 1)) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        });
    });
    }


    let response = undefined
    try{
        const checkVenue = await validateVenue(event.venueName)

        if(!checkVenue){

            const result = await DeleteVenue(event.venueName)
            if(!result){
                response = {
                    statusCode: 400,
                
                    error: "No rows affected"
                }
            }
            else{
                response = {
                    statusCode : 200,
            
                    venueName : event.venueName,

                    success: JSON.stringify(result)
                }
            }
        }
        else{
            response = {
                statusCode : 401,

                error : "Shows are active in Venue"
            }
        }
        
    }
    catch(err){
        response = {
            statusCode : 400,
            error : err
        }
    }finally{
        pool.end()
    }
    return response

}
