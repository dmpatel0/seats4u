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

// check for number
// center left right
  function validateInput(){
         let valid = false;
        for(let k = 0; k <= 2; k++){
            let numCol = event.sections[k].numOfCol;
            let secName = event.sections[k].sectionName;
            if((secName === "left" | secName === "right" | secName === "center") && (typeof numCol === 'number')){
                valid = true;
            }
        }
        return valid;
  }

  
  let response = undefined;
  
  let createSection = (venueName, numOfCol, sectionName) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Sections(venueName, numOfCol, sectionName) VALUES(?, ?, ?);", [venueName, numOfCol, sectionName], (error, rows) => {
                if(error){
                    return reject(error);
                }
                if((rows) && (rows.affectedRows == 1)){
                    return resolve(true);
                }
                else{
                    return resolve(false);
                }

        });
    });

    }

    async function process(){
            for(let k = 0; k <= 2; k++){
                let columns = event.sections[k].numOfCol;
                let name = event.sections[k].name;
                try{
                let addSection = await createSection(event.venueName, columns, name);
                    if(!addSection){
                        return response ={
                            statusCode: 400,
                            error: "error"
                        }
                    }
                }
                catch(error){
                    return response ={
                        statusCode: 400,
                        
                        "error" : error
                }
        
            }
            
            }
            response = {
                statusCode: 200,
        
                "venueName": event.venueName,
        
                "sections": [{"numOfCol": event.sections[0].numOfCol, "sectionName": event.sections[0].sectionName}, {"numOfCol": event.sections[1].numOfCol, "sectionName": event.sections[1].sectionName}, {"numOfCol": event.sections[2].numOfCol, "sectionName": event.sections[2].sectionName} ]
            }
        }

        if(validateInput()){
            process();
        }
        else{
            response = {
                statusCode: 400,

                error: "invalid input. Section name needs to be either 'center', 'left', or 'right'. Number of columns needs to be an number."
            }
        }

        pool.end();
        return response;

}

  
   


