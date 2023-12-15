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

  let listShows = (venueName) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT showName, showTime FROM Shows where venueName = ?", [venueName], (error, rows) => {
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows);
                }
        })
     
    })
    
  }
  
  let response = undefined;
  try{
    const allShows = await listShows(event.venueName);
        response = {
            statusCode: 200,
            
            "venueName" : event.venueName
        }
  }
  catch(error){
    response = {
        statusCode: 400,

        "error": error
    }
  }

  pool.end();
  return response;

}