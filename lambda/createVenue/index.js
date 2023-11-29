const mysql = require('mysql');
const { resolve } = require('path');
const db_access = require('/opt/nodejs/db_access')
const crypto = require('crypto'); 

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });

  let checkExists = (name) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Venues WHERE venueName=?", [name], (error, rows) => {
            if (error) { return reject(error); }
            if ((rows) && (rows.length == 1)) {
                return resolve(true); 
            } else {
                return resolve(false);
            }
        });
    });
}

let response = undefined;
var id = crypto.randomUUID();
const venueExists = await checkExists(event.venueName);

if(!venueExists){
    let addVenue = (venueName, numRows, password) => {
        return new Promise((resolve, reject) => {
    pool.query("INSERT INTO Venues VALUES(?, ?, ?);", [venueName, numRows, password], (error, rows) => {
        if(error){
            return reject(error);
        }
        if((rows) && (rows.affectedRows == 1)){
            return resolve(true);
        }
        else{
            return resolve(false);
        }
    });
});
    }
let createResult = await addVenue(event.venueName, event.numRows, event.password);

response = {
    statusCode: 200,

    "venueName" : event.venueName,
    
    success: createResult
}
}
else {
    response = {
        statusCode: 400,
        
        "error" : "Failed"
    }
};

pool.end();

return response;

}


