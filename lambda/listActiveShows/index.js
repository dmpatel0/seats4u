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


  


  let listActiveShow = (venueName, isActive) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT showID, showName, showTime FROM Shows where venueName = ? AND isActive = ? AND showTime >= CURRENT_TIMESTAMP", [venueName, isActive], (error, rows) => {
            if(error){
                return reject(error);
            }
            return resolve(rows);
        })
    })
  }

  let isSoldOut = (showID) => {
    return new Promise((resolve, reject) => {
        pool.query("select count(*) as total from Seats where showID = ? AND isPurchased = 0", [showID], (error, rows) => {
            if(error){
                return reject(error);
            }
            if(rows[0].total === 0){
                return resolve(true);
            }
            else{
                return resolve(false);
            }
        })
    })
  }

  let response = undefined;
  let validShows = undefined;

  try{
    let result = await listActiveShow(event.venueName, 1);
    for(let k =0; k < result.length; k++){
        let showAdd = undefined;
        let isSold = await isSoldOut(result[k].showID);
        showAdd = {"showID": result[k].showID, "showTime": result[k].showTime, "isSoldOut": isSold};
        validShows.push(showAdd);
        

    }
    response = {
        statusCode: 200,

        shows: validShows
    }
  }
  catch(error){
    response = {
        statusCode: 400,

        error: error
    }
  }

  pool.end();

  return response;


}