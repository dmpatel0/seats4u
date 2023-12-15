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

  let allCurrentBlocks = (showID) => {
    return new Promise((resolve, reject) => {
        pool.query("select startRow, endRow, sectionID from Blocks where showID = ?", [showID], (error, rows) => {
            if(error){
                return reject(error);
            }
            else{
                return resolve(rows);
            }
        })
    })
  }

let anyNullSeats = (showID) => {
    return new Promise((resolve, reject) => {
        pool.query("select count(*) as total from Seats where showID = ? and blockID IS null", [showID], (error, rows) => {
            if(error){
                return reject(error);
            }
            if(rows[0].total === 0){
                return resolve(false);
            }
            else{
                return resolve(true);
            }
        })
    })
}

let response = undefined;

try{
    let validSeats = await anyNullSeats(event.showID);
    if(validSeats){
        response = {
            statusCode: 400,
            error: "All seats do not have a block"
        }
    }
}
catch(error){
    response =  {
        statusCode: 400,
        error: error
    }
}

if(!response){
try{
  let blocks = await allCurrentBlocks(event.showID);
  for(let k = 0; k < blocks.length; k++){
    for(let i = k +1; i < blocks.length; i++){
        if(blocks[k].sectionID === blocks[i].sectionID){
            if(blocks[i].startRow >= blocks[k].startRow && blocks[i].startRow <= blocks[k].endRow || blocks[i].endRow <= blocks[k].endRow && blocks[i].endRow >= blocks[k].startRow){
                response = {
                    statusCode: 400,
                    error: "Blocks are overlapping. Change block configuration."
                }
            }
        }
    }
  }
}
catch(error){
    response = {
        statusCode: 400,
        error: error
    }
}
}
else{
    pool.end();
    return response;
}

if(!response){
response = {
    statusCode: 200,
    success: "Blocks are valid"
}
}

pool.end();
return response;





}