const { count } = require('console');
const mysql = require('mysql');
const { setDefaultAutoSelectFamily } = require('net');
const { resolve } = require('path');
const db_access = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });


  //get showID and price

  let getShowID = (showName, showTime, venueName) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT showID From Shows where showName = ? AND showTime = ? AND venueName = ?", [showName, showTime, venueName], (error, rows) => {
            if(error){
                return reject(error);
            }
            else{
                return resolve(rows[0].showID);
            }
        })
    })
  }


  let getSinglePrice = (showName, showTime, venueName) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT singlePrice From Shows where showName = ? AND showTime = ?", [showName, showTime, venueName], (error, rows) => {
            if(error){
                return reject(error);
            }
            else{
                return resolve(rows[0].singlePrice);
            }
        })
    })
  };

  let venueRows = (venueName) => {
    return new Promise((resolve,reject) => {
        pool.query("SELECT numRows from Venues where venueName = ?", [venueName], (error, rows) => {
            if(error){
                return reject(error);
            }
            else{
                return resolve(rows[0].numRows)
            }
        })
    })
  };

  let sectionID = (venueName, rowNum) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT sectionID from Sections where venueName = ?", [venueName], (error, rows) => {
            if(error){
                return reject(error);
            }
            else{
                return resolve(rows[rowNum].sectionID);
            }
        })
    })
  };

  let insertBlock = (showID, startRow, endRow, price, sectionID) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Blocks(showID, startRow, endRow, price, sectionID) VALUES(?, ?, ?, ?, ?)", [showID, startRow, endRow, price, sectionID], (error, rows) => {
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
    };

    let response = undefined;
    let showid = undefined;
    let price = undefined;
    let rows = undefined;

    try{
         showid = await getShowID(event.showName, event.showTime, event.venueName);
         price  = await getSinglePrice(event.showName, event.showTime,event.venueName);
         rows = await venueRows(event.venueName);
    }
    catch(error){
        response = {
            statusCode: 400,
            error: error
        }
    }  



    

    for(let k = 0; k <= 2; k++){
        let id = await sectionID(event.venueName, k);
        try{
            let block = await insertBlock(showid, 1, rows, price, id);
            if(!block){
                response = {
                    statusCode: 200,
                    error: error
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

    response = {
        statusCode: 200,

        success: "Blocks created"
    }

    pool.end();
    return response;
}

            
        
    
            
        
        
  





  



