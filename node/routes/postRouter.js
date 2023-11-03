const { contentTypes } = require("../config/mimeTypes");
const { calcRes, whatOp } = require("../utils/calc");

let arrPost = [];
function postRouter(request, response) {
    let chunkCount = 0;
    switch (request.url) {
        case "/postCalc":
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
                chunkCount += 1;
            });
            request.on("end", () => {
                chunkCount = 0;
                if (data.length) {
                    let arrData = data.split(" ");
                    if((arrData[1] == '+') || (arrData[1] == '-') || (arrData[1] == '/') || (arrData[1] == '*')){
                         let obj = {
                            A: arrData[0],
                            op: arrData[1],
                            B: arrData[2]
                        } 
                        
                        arrPost.push(obj);
                        response.end(`${calcRes(parseInt(arrData[0]), parseInt(arrData[2]), arrData[1])}`);
                    }
                    else{
                        response.end('Ошибка')
                    }
                }
                if (!data.length) {
                    response.end("Bad request :(");
                }
            });
            break;

        case "/postJson": {
            let dataFromClient = "";
            request.on("data", (chunk) => {
                dataFromClient += chunk;
            });

            request.on("end", () => {
                chunkCount = 0;
                if (dataFromClient.length) {
                    const obj = JSON.parse(dataFromClient);
                    if((obj.op == '+') || (obj.op == '-') || (obj.op == '/') || (obj.op == '*')){
                    const result = calcRes(parseInt(obj.A), parseInt(obj.B), obj.op);
                    const dataForClient = {
                        ...obj,
                        result: result,
                        
                    };
                    if(obj.clearInfo == false){
                        arrPost.push(obj);
                    }else if(obj.clearInfo == true){
                        arrPost = [];
                    }
                        console.log(arrPost);
                    response.writeHead(200, {
                        "Content-Type": "application/json; charset=utf-8",
                    });

                    response.end(JSON.stringify(dataForClient));
                    }
                    
                    
                } else {
                    response.writeHead(400, {
                        "Content-Type": "text/plain; charset=utf-8",
                    });
                    response.end("Ошибка");
                }
            });
            break;
           
                
        }   
    }
}
module.exports = postRouter;
