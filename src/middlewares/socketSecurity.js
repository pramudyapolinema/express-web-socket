require("dotenv").config();

function socketSecurity(ws, req, next) {
    if (req.headers["x-socket-key"] === process.env.SOCKET_KEY) {
        next();
    } else {
        ws.close();
        return res.status(403).send({ message: "Forbidden" });
    }
}

module.exports = socketSecurity;
