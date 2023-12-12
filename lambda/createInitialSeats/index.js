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

// findShowID
let findShowID = (showName, venueName, showTime) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT showID FROM Shows WHERE (showName=? AND venueName=? AND showTime=?)", [showName, venueName, showTime], (error, rows) => {
            if (error) { return reject(error); }
            console.log(rows)
            if ((rows) && (rows.length == 1)) {
                return resolve(rows[0].showID); 
            } else {
                return resolve(false);
            }
        });
    });
}

//get the sections for the venueName
let findSection = (venueName, sectionName) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Sections WHERE venueName=? AND sectionName = ?", [venueName, sectionName], (error, rows) => {
            if (error) { return reject(error); }
            if (rows && rows.length == 1) {
                return resolve(rows); 
            } else {
                return resolve(false);
            }
        });
    });
}

//find rows for venues
let findRows = (venueName) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT numRows FROM Venues WHERE venueName=?", [venueName], (error, rows) => {
            if (error) { return reject(error); }
            if ((rows) && (rows.length == 1)) {
                return resolve(rows[0].numRows); 
            } else {
                return resolve(false);
            }
        });
    });
}

//findBlockID
let findBlockID = (showID, row, sectionID) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT blockID FROM Blocks WHERE showID=? AND sectionID = ? AND startRow <= ? AND endRow >= ?", [showID, sectionID, row, row], (error, rows) => {
            if (error) { return reject(error); }
            if ((rows) && (rows.length == 1)) {
                return resolve(rows[0].blockID); 
            } else {
                return resolve(false);
            }
        });
    });
}


let response = undefined;
try{
    //get showID, rows, and section
    const showID = await findShowID(event.showName, event.venueName, event.showTime);
    const rows = await findRows(event.venueName);
    let createSeat = (rowNum, colNum, blockID) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT into Seats(showID,rowNum,colNum,isAvailable,isPurchased,blockID) VALUES(?,?,?,1,0,?);", [showID, rowNum, colNum, blockID], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.affectedRows == 1)) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    let columns = 0;
    let sectionName = undefined;
    for(let k = 0; k <= 2; k++){
        switch (k) {
            case 0:
                sectionName = "left";
                break;
            case 1:
                sectionName = "center";
                break;
            case 2:
                sectionName = "right";
                break;
            default:
                break;
        }
        for(let r = 0; r < rows; r++){
            columns = 0
                try{
                    let sections = await findSection(event.venueName, sectionName);
                    let block = await findBlockID(showID, r+1, sections[0].sectionID)
                    for(let c = columns; c < columns+sections[0].numOfCol; c++){
                        try{
                            let addSeat = await createSeat(r+1, c+1, block);
                            if(!addSeat){
                                response = {
                                    statusCode: 400,
                                
                                    error: "Row not affected"
                                }
                                break;
                            }
                        }
                        catch(error){
                            response = {
                                statusCode: 400,
                                
                                "error" : error
                            }
                        }
                    }
                    columns = columns+sections[0].numOfCol;
                }catch(error){
                    response = {
                        statusCode: 400,
                
                        error: error
                    }
                }
        }
    }
    if(response === undefined){
        response = {
            statusCode : 200,

            showName : event.showName, 
            venueName : event.venueName, 
            showTime : event.showTime
        }
    }
}
catch(error){
    response = {
        statusCode: 400,

        error: error
    }
}finally{
    pool.end()
}
    return response;
}


  
   


