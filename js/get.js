
const fetch = require('node-fetch');
async function requestbase(apikey,host="http://localhost",command = "serverlist",serverid = "") {
    try {
        if (serverid != "") {
            serverid = `${serverid}/`
        }
        //console.log(`${host}${serverid}${command}`)
        const res = fetch(`${host}${serverid}${command}`,{
            headers: {
                'x-api-key': apikey
            }
        });
        return res
    } catch (err) {
        return {"status":{"code":1,"message":err.message}};
    }
}


module.exports = (apikey,host,command,serverid = "") => {
    return requestbase(apikey,host,command,serverid).then(result => {
        return result.json()
    }).then(result => {
        return result
    }).catch((err) => {
        return {
            "status":
                {
                    "code":1,
                    "message":err.message
                }
            }
    });
}
