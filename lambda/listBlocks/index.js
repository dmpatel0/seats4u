const { count } = require('console');
const mysql = require('mysql');
const { setDefaultAutoSelectFamily } = require('net');
//const { setGlobalDispatcher } = require('undici-types');
const db_access = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });


    let allBlocks = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("Select price, startRow, endRow, sectionName from Blocks join Sections where showID = ?", [showID], (error, rows) => {
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
        let blocks = await allBlocks(event.showID);
        response = {
            statusCode: 200,

            blocks: blocks
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