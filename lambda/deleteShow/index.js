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

  

  let deleteShow = (venueName, showName, showTime, isActive) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Shows where venueName = ? AND showName = ? AND showTime = ? AND isActive = ?", [venueName, showName,showTime, isActive], (error, rows) => {
                    if(error){
                        return reject(error);
                    }
                    if((rows) && (rows.affectedRows === 1)){
                        return resolve(true);
                    } 
                    else{
                        return resolve(false);
                    }
            })
        })
  }


    try{
        let show = await deleteShow(event.venueName, event.showName, event.showTime, false);
        if(!show){
            response = {
                 statusCode: 400,

                 error: "No rows affected"
            }
        }
        else{
            reponse = {
                statusCode: 200,

                success: show

            }
        }
    }
    catch(error){
        reponse = {
            statusCode: 400,

            error: error
        }
    }

    pool.end();
    return response;

}