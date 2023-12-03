const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });



    let findShowID = (showName, venueName, showTime) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT showID FROM Seats WHERE (showName=? AND venueName=? AND showTime=?)", [showName, venueName, showTime], (error, rows) => {
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

    let response = undefined
    try{
        const showID = await findShowID(event.showName, event.venueName, event.showTime);

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
        try{
            let addresult = await createSeat(rowNum, colNum, blockID);

            response = {
                statusCode: 200,
                showID : showID,
                rowNum: event.rowNum,
                colNum: event.colNum,
                blockID: event.blockID,

                success: addresult
            }
        }catch(err){
            response = {
                statusCode : 400,
    
                error : err
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