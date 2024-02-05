require('dotenv').config();

function adsSecurity(req, res, next) {
    if (req.headers['x-socket-key'] === process.env.SOCKET_KEY) {
        next();
    } else {
        res.status(403).send({ message: 'Forbidden' });
    }
}

module.exports = adsSecurity;