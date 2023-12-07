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
            let getSeats = (showID, blockID) => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM Seats WHERE (showID = ? AND blockID = ?)", [showID,blockID], (error, rows) => {
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

                let leftSeats = undefined;
                let centerSeats = undefined;
                let rightSeats = undefined;
                let sectionName = undefined
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
                    let blocks = await getBlocks(event.showID, sectionName);
                    let seats = [];
                    for(let i = 0; i < blocks.length; i++){
                        let newSeats = await getSeats(event.showID, blocks[i].blockID)
                        seats = seats.concat(newSeats)
                    }
                    switch(k){
                        case 0:
                            leftSeats = seats;
                            break;
                        case 1:
                            centerSeats = seats;
                            break;
                        case 2:
                            rightSeats = seats;
                            break;
                        default:
                            break;
                    }                    
                }
                response = {
                    statusCode: 200,
                    
                    seats : {"left" : leftSeats, "center" : centerSeats, "right" : rightSeats}
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