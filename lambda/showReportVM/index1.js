const { count } = require('console');
const mysql = require('mysql');
const { setDefaultAutoSelectFamily } = require('net');
//const { setGlobalDispatcher } = require('undici-types');
const db_access = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: db_access.config.host,
      user: db_access.config.user,
      password: db_access.config.password,
      database: db_access.config.database
  });

     //check both if equal to 
     //if yes return a hard coded response;


    let allShows = (venueName, venueName, venueName, venueName) => {
        return new Promise((resolve, reject) => {
            pool.query("select * from ((select  Shows.showID, showName, showTime, venueName, isActive, count(*) AS ticketsPurchased, sum(price) AS totalProfit from Shows Join Seats on Shows.showID = Seats.showID Join Blocks on Seats.blockID = Blocks.blockID where isPurchased = 1 AND venueName = ? group by  showTime, venueName) A left join (select Shows.showID, showName, showTime, venueName, isActive, count(*) As ticketsRemaining from Shows Join Seats on Shows.showID = Seats.showID where isPurchased = 0 AND venueName = ? group by showID) B on A.showID = B.showID) UNION select * from ((select  Shows.showID, showName, showTime, venueName, isActive, count(*) AS ticketsPurchased, sum(price) AS totalProfit from Shows Join Seats on Shows.showID = Seats.showID Join Blocks on Seats.blockID = Blocks.blockID where isPurchased = 1 AND venueName = ? group by  showTime, venueName) A right join (select Shows.showID, showName, showTime, venueName, isActive, count(*) As ticketsRemaining from Shows Join Seats on Shows.showID = Seats.showID where isPurchased = 0 AND venueName = ? group by showID) B on A.showID = B.showID);", 
            [venueName, venueName, venueName, venueName], (error, rows) =>{
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows);
                }
            })
        })
    }
    let response = undefined;
    try{
        let showReport = await allShows(event.venueName, event.venueName, event.venueName, event.venueName);
        response = {
            statusCode: 200,

            report: showReport
        }
    }
    catch(error){
        response = {
            statusCode: 400,

            error: error
        }
    }

    pool.end();
    return response;

}

