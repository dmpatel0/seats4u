const { count } = require('console');
const mysql = require('mysql');
const { setDefaultAutoSelectFamily } = require('net');
const db_access = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });

  let validateSeat = (showID, rowNum, colNum) => {
    return new Promise((resolve, reject) => {
        pool.query("select * from Seats where showID = ? AND rowNum = ? AND colNum = ?", [showID, rowNum, colNum], (error, rows) => {
            if(error){
                return reject(error);
            }
            if((rows) && rows.length === 1){
                return resolve(true);
            }
            else{
                return resolve(false);
            }
        })
    })
   }
   
   let checkActive = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT Shows.isActive FROM Shows WHERE showID = ? AND showTime >= CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'US/Eastern')", [showID], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    if(rows[0].isActive === 1){
                        return resolve(true); 
                    }
                    else{
                        return resolve(false);
                    }
                } else {
                    return reject("Show not found or Show time past current Date");
                }
            });
        });
    }

   
   //check if any seat is purchased
 
   let isSeatPurchased = (showID, rowNum, colNum) => {
    return new Promise((resolve, reject) => {
        pool.query("select isPurchased from Seats where showID = ? AND rowNum = ? AND colNum = ?", [showID, rowNum, colNum], (error, rows) => {
            if(error){
                return reject(error);
            }
            if(rows[0].isPurchased === 0){
                return resolve(true);
            }
            else{
                return resolve(false);
            }
        })
    })
   }



   let updateSeats = (status, showID, rowNum, colNum) => {
        return new Promise((resolve, reject) => {
            pool.query("update Seats set isPurchased = ? where showID = ? AND rowNum = ? AND colNum = ?", [status, showID, rowNum, colNum], (error, rows) => {
                if(error){
                    return reject(error);
                }
                if((rows) && rows.affectedRows === 1){
                    return resolve(true);
                }
                else{
                    return resolve(false);
                }
            })
        })
   }

   let response = undefined;
   try{
        let validShow = await checkActive(event.showID);
        if(validShow){
            for(let k = 0; k < event.seats.length;k ++){
                try{
                    let valid = await validateSeat(event.showID, event.seats[k].rowNum, event.seats[k].colNum);
                    if(valid){
                    let seatStatus = await isSeatPurchased(event.showID, event.seats[k].rowNum, event.seats[k].colNum);
                    if(!seatStatus){
                        response ={
                            statusCode: 401,
                            error: "Seat with row  " + event.seats[k].rowNum + " and column " + event.seats[k].colNum + " has been purchased. Refresh the page and try again."
                        }
                        break;
                    }
                    }
                    else{
                        response = {
                            statusCode: 400,
                            error: "Seat does not exist"
                        }
                        break;
                    }
                }
                catch(error){
                     response ={
                        statusCode: 400,
                        error: "error"
                    }
                    break;
                }
           }
           if(!response){
                for(let k = 0; k < event.seats.length; k++){
                        try{
                            
                            let updateSeat = await updateSeats(1, event.showID, event.seats[k].rowNum, event.seats[k].colNum);
                            if(!updateSeat){
                                response = {
                                    statusCode: 400,
                                    error: "Update not successful"
                                }
                                break;
                            }
                        }
                        catch(error){
                            response = {
                                statusCode: 400,
                                error: error
                            }
                            break;
                        }
                    
                }
                if(!response){
                    response = {
                            statusCode: 200,
                            success: "All seats have been purchased."
                    }
                }
            }
        }
   }catch(err){
    response = {
        statusCode: 400,
        error: JSON.stringify(err)
    }
   }  
   pool.end();
   return response;
}