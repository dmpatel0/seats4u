const { count } = require('console');
const mysql = require('mysql');
const { setDefaultAutoSelectFamily, BlockList } = require('net');
const db_access = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });


  let getPrice = (showID, rowNum, colNum) => {
    return new Promise ((resolve, reject) => {
        pool.query("select price from Seats Join Blocks on Seats.blockID = Blocks.blockID where showID = ? AND rowNum = ? AND colNum = ?", [showID, rowNum, colNum], (error, rows) => {
            if(error){
                return reject(error);
            }
            if((rows) && rows.length === 1){
               return resolve(rows[0].price)
            }
            else{
                return resolve(-1);
            }
        })
    })
  }

  let response = undefined;

  try{
    let result = await getPrice(event.showID, event.rowNum, event.colNum);
    if(result < 0){
        response = {
            statusCode: 400,
            error: "No price returned"
        }
    }
    else{
        response = {
            statusCode: 200,
            price: result
        }
    }
  }
  catch(error){
    response ={
        statusCode: 400,
        error: error
    }
  }

  pool.end();
  return response;



}
/*
select price
from Seats Join Blocks 
on Seats.blockID = Blocks.blockID;
where showID = ? AND rowNum = ? AND colNum = ?
*/