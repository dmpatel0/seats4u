const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    //validates there are seats for the given showID
    let validateExists = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Seats WHERE (showID = ?)", [showID], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length >= 1)) {
                    return resolve(true); 
                } else {
                    return resolve(false);
                }
            });
        });
    }

    let venueInformation = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT Venues.venueName, Venues.numRows FROM Shows JOIN Venues ON Shows.venueName = Venues.venueName WHERE (showID = ?)", [showID], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    return resolve(rows); 
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
                if (rows) {
                    return resolve(rows); 
                } else {
                    return resolve(false);
                }
            });
        });
    }

    let getColumns = (venueName, sectionName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT numOfCol FROM Sections WHERE (venueName = ? AND sectionName = ?)", [venueName, sectionName], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    return resolve(rows[0].numOfCol); 
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
                console.log(rows)
                if ((rows) && (rows.length == 1)) {
                    return resolve(rows[0].blockID); 
                } else {
                    return resolve(false);
                }
            });
        });
    }

    let response = undefined
    try{
        const can_create = await validateExists(event.showID);
    
        if(can_create){
            let editSeat = (showID,blockID, row, col) => {
                return new Promise((resolve, reject) => {
                    pool.query("UPDATE Seats SET blockID = ? WHERE (showID = ? AND rowNum = ? AND colNum = ?)", [blockID, showID, row, col], (error, rows) => {
                        if (error) { return reject(error); }
                        if ((rows && rows.affectedRows == 1)) {
                            return resolve(true);
                        } else {
                            return resolve(false);
                        }
                    });
                });
            }   
            try{
                let venue = await venueInformation(event.showID);
                let nRows = venue[0].numRows;
                let columns = 0;
                let sectionName = undefined;
                for(let r = 0; r < nRows; r++){
                    columns = 0
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
                        try{
                            let sections = await findSection(venue[0].venueName, sectionName);
                            let block = await findBlockID(event.showID, r+1, sections[0].sectionID)
                            for(let c = columns; c < columns+sections[0].numOfCol; c++){
                                try{
                                    let updateSeat = await editSeat(event.showID, block, r+1, c+1);
                                    if(!updateSeat){
                                        response = {
                                            statusCode: 400,
                                            row: r,
                                            col: c,
                                            error: "Seat not updated"
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
            }catch(err){
                response = {
                    statusCode : 400,
        
                    error : err
                }
            }
            
        }else{
            response = {
                statusCode : 400,

                error: "No seats for given Show"
            }
        }
    }catch(err){
        response = {
            statusCode : 400,

            error : err
        }
    }finally{
        pool.end()
    }
    return response;
}