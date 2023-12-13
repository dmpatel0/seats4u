const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });



    let deleteExistingBlocks = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Blocks WHERE showID = ?", [showID], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.affectedRows >= 1)) {
                    return resolve(true); 
                } else {
                    return resolve(false);
                }
            });
        });
    }

    let response = undefined
    try{
        const can_create = await deleteExistingBlocks(event.showID);
        if(can_create){
            let createBlock = (showID, startRow, endRow, price, sectionID) => {
                return new Promise((resolve, reject) => {
                    pool.query("INSERT into Blocks(showID,startRow,endRow,price,sectionID) VALUES(?,?,?,?,?);", [showID,startRow, endRow, price, sectionID], (error, rows) => {
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
                let newBlocks = event.blocks

                for(let i = 0; i < newBlocks.length; i++){
                    let addresult = await createBlock(event.showID, newBlocks[i].startRow, newBlocks[i].endRow, newBlocks[i].price, newBlocks[i].sectionID);
                    if(!addresult){
                        response = {
                            statusCode : 400,
        
                            error : "Block " + (i +1) + " in the input not created"
                        }
                    }
                }
                if(response === undefined){
                    response = {
                        statusCode: 200,
                        showID: event.showID,
                        blocks : event.blocks
                    }
                }
            }catch(err){
                response = {
                    statusCode : 400,
        
                    error : JSON.stringify(err)
                }
            }
            
        }else{
            response = {
                statusCode : 400,

                error: "Existing blocks not deleted"
            }
        }
    }catch(err){
        response = {
            statusCode : 400,

            error : JSON.stringify(err)
        }
    }finally{
        pool.end()
    }
    return response;
}