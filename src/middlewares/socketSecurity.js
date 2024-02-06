require("dotenv").config();
var url = require("url");

function socketSecurity(ws, req, next) {
    var params = url.parse(req.url, true).query;
    if (params.token === process.env.SOCKET_KEY) {
        next();
    } else {
        ws.close();
        return res.status(403).send({ message: "Forbidden" });
    }
}

module.exports = socketSecurity;
