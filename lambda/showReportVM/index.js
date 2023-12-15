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

  //go through each show, generate report

  //get seats in venue
  //get number of shows in venue

  //get seats purchased for show
  //if zero or equal to total seats hardcode
  //if not use query

  let showsInVenue = (venueName, rowNum) => {
    return new Promise((resolve, reject) => {
        pool.query("select showID from Shows where venueName = ? ", [venueName, rowNum], (error, rows) => {
            if(error){
                return reject(error);
            }
            else{
                return resolve(rows[rowNum].showID);
            }
        })
        })
}

let numberOfShows = (venueName) => {
    return new Promise((resolve, reject) => {
        pool.query("select count(*) as total from Shows where venueName = ? ", [venueName], (error, rows) => {
            if(error){
                return reject(error);
            }
            else{
                return resolve(rows[0].total);
            }
        })
        })
}


    let nonePurchased = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select count(*) as total from Seats where showID = ? AND isPurchased = 1", [showID], (error, rows) => {
                if(error){
                    return reject(error);
                }
                if((rows) & (rows[0].total === 0)){
                    return resolve(true);
                }
                else{
                    return resolve(false);
                }
            })
            })
    }

    let allPurchased = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select count(*) as total from Seats where showID = ? AND isPurchased = 0", [showID], (error, rows) => {
                if(error){
                    return reject(error);
                }
                if((rows) & (rows[0].total === 0)){
                    return resolve(true);
                }
                else{
                    return resolve(false);
                }
            })
            })
    }

    let singleShowReport = (showID, showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select  * from ((select  Shows.showID , showName, showTime, venueName, isActive, count(*) AS ticketsPurchased, sum(price) AS totalProfit from Shows natural join Seats Join Blocks on Seats.blockID = Blocks.blockID where isPurchased = 1 AND Shows.showID = ? group by  showTime, venueName) A join (select Shows.showID, showName, showTime, venueName, isActive, count(*) As ticketsRemaining from Shows natural join Seats where isPurchased = 0 AND Shows.showID = ? group by showID) B on A.showID = B.showID );", 
            [showID, showID], (error, rows) =>{
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows[0]);
                }
            })
        })
    }

    let getShowTime = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select showTime from Shows where showID = ? ", [showID], (error, rows) => {
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows[0].showTime);
                }
            })
            })
    }
    
    let getActive = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select isActive from Shows where showID = ?", [showID], (error, rows) => {
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows[0].isActive);
                }
            })
            })
    }

    let totalSeats = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select count(*) as total from Seats where showID = ?", [showID], (error, rows) => {
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows[0].total);
                }
            })
            })
    }

    let totalProfit = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select  sum(price) AS totalProfit from Shows natural join Seats Join Blocks on Seats.blockID = Blocks.blockID where isPurchased = 1 AND Shows.showID = ?", [showID], (error, rows) => {
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows[0].totalProfit);
                }
            })
            })
    }

    let getShowName = (showID) => {
        return new Promise((resolve, reject) => {
            pool.query("select showName from Shows where showID = ? ", [showID], (error, rows) => {
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(rows[0].showName);
                }
            })
            })
    }
  

    let response = undefined;
    let numShows = undefined;
    let showsReport = [];
    let addShowInfo = undefined;
    let showid = undefined;
    let showtime = undefined;
    let showname = undefined;
    let showactive = undefined;
    let areNonePurchased = undefined;
    let areAllPurchased = undefined;
    let curentShowReport = undefined;
    let numSeats = undefined;
    let profit = undefined;

    try{
        numShows = await numberOfShows(event.venueName);
    }
    catch(error){
        response = {
            statusCode: 400,
            error: error
        }
    }
    if(!response){
    for(let k = 0; k < numShows; k++){
        try{
         addShowInfo = undefined;
            showid = await showsInVenue(event.venueName, k);
            showtime = await getShowTime(showid);
            showname = await getShowName(showid);
          showactive = await getActive(showid);
          areNonePurchased = await nonePurchased(showid);
         areAllPurchased = await allPurchased(showid);
          curentShowReport = await singleShowReport(showid, showid);
          numSeats = await  totalSeats(showid);
          profit = await totalProfit(showid);
        }
        catch(error){
            response = {
                statusCode: 400,
                error: error
            }
            break;
        }
        if(areNonePurchased){
            addShowInfo = {"showID": showID, "showName": showname, "showTime": showtime, "isActive": showactive, "venueName": event.venueName, "ticketsPurchased": 0, "totalProfit": 0, "ticketsRemaining":numSeats};
            showsReport.push(addShowInfo);
        } 
        else if(areAllPurchased){
            addShowInfo = {"showID": showID,"showName": showname, "showTime": showtime, "isActive": showactive, "venueName": event.venueName, "ticketsPurchased": numSeats, "totalProfit": profit, "ticketsRemaining": 0};
        }
        else{
                showsReport.push(curentShowReport);
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
        report: showsReport
    }
}

    pool.end();
    return response;


}






/*
select * from (
    (select  Shows.showID, showName, showTime, venueName, isActive, count(*) AS ticketsPurchased, sum(price) AS totalProfit
        from Shows Join Seats 
       on Shows.showID = Seats.showID
       Join Blocks on Seats.blockID = Blocks.blockID
       where isPurchased = 1 AND venueName = 'Gillette'
       group by  showTime, venueName) A
         left join
        (select Shows.showID, showName, showTime, venueName, isActive, count(*) As ticketsRemaining 
        from Shows Join Seats
        on Shows.showID = Seats.showID
        where isPurchased = 0 AND venueName = 'Gillette'
        group by showID) B on A.showID = B.showID)
    UNION
    select * from (
    (select  Shows.showID, showName, showTime, venueName, isActive, count(*) AS ticketsPurchased, sum(price) AS totalProfit
        from Shows Join Seats 
       on Shows.showID = Seats.showID
       Join Blocks on Seats.blockID = Blocks.blockID
       where isPurchased = 1 AND venueName = 'Gillette'
       group by  showTime, venueName) A
         right join
        (select Shows.showID, showName, showTime, venueName, isActive, count(*) As ticketsRemaining 
        from Shows Join Seats
        on Shows.showID = Seats.showID
        where isPurchased = 0 AND venueName = 'Gillette'
        group by showID) B on A.showID = B.showID);
        



        CREATE DEFINER = CURRENT_USER TRIGGER `calc`.`Blocks_BEFORE_INSERT` BEFORE INSERT ON `Blocks` FOR EACH ROW
BEGIN
	DECLARE finished bool default false;
	DECLARE errormsg varchar(100);
    DECLARE startNum int;
    DECLARE endNum int;
	DECLARE  c1 cursor for select startRow, endRow from Blocks where showID = new.showID AND sectionID = new.sectionID;
    DECLARE continue handler for not found set finished = true;
    
    open c1;
    
    c1_loop: Loop
    fetch c1 into startNum, endNum;
		if (finished = true) Then
			LEAVE c1_loop;
		END if;
    
		if(new.startRow >= startNow && new.startRow <= endNum || new.endRow <= endNum && new.endRow >= startNum) Then 
			set errormsg =  'Cannot insert a block where an existing block exists. Cannot overlap blocks.';
            signal sqlstate '45000' set message_text = errormsg;
        END if;
	
	END Loop;
    
    close c1;
    


END
*/