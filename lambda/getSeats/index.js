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
    

    //gets the blockIDs for all blocks given a section and showID
    let getBlocks = (showID, sectionName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT blockID FROM Blocks JOIN Sections ON Blocks.sectionID = Sections.sectionID WHERE (showID = ? AND sectionName = ?)", [showID, sectionName], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length >= 1)) {
                    return resolve(rows); 
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
            let getSeats = (showID) => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM Seats WHERE (showID = ?) ORDER BY rowNum, colNum", [showID], (error, rows) => {
                        if (error) { return reject(error); }
                        if ((rows)) {
                            return resolve(rows);
                        } else {
                            return resolve(false);
                        }
                    });
                });
            }   
            try{
                let venue = await venueInformation(event.showID)
                let nRows = venue[0].numRows;
                let sectionName = undefined;
                let leftCol = undefined;
                let centerCol = undefined;
                let rightCol = undefined;

                let allSeats = await getSeats(event.showID);

                for(let k = 0; k <=2; k++){
                    switch(k){
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
                    let columns = await getColumns(venue[0].venueName, sectionName);
                    switch(k){
                        case 0:
                            leftCol = columns;
                            break;
                        case 1:
                            centerCol = columns;
                            break;
                        case 2:
                            rightCol = columns;
                            break;
                        default:
                            break;
                    }                    
                }
                response = {
                    statusCode: 200,
                    
                    seats : {"seats": allSeats,
                             "left" : {"rows" : nRows, "columns" : leftCol}, 
                             "center" : {"rows" : nRows, "columns" : centerCol}, 
                             "right" : {"rows" : nRows, "columns" : rightCol}}
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