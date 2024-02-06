var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require("multer");
var db = require("./db/models/index");
const { body, validationResult } = require("express-validator");

var app = express();
var expressWs = require("express-ws")(app);

var apiSecurity = require("./middlewares/apiSecurity");
var socketSecurity = require("./middlewares/socketSecurity");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer().array());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res, next) {
    res.render("index.html");
});

app.post(
    "/",
    apiSecurity,
    [
        body("source").notEmpty().withMessage("Source is required"),
        body("event").notEmpty().withMessage("Event is required"),
        body("title").notEmpty().withMessage("Title is required"),
        body("message").notEmpty().withMessage("Message is required"),
        // check if data is a valid JSON and not empty
        body("data")
            .custom((value) => {
                if (value) {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch (error) {
                        throw new Error("Data is not a valid JSON");
                    }
                }
                return true;
            })
            .withMessage("Data is not a valid JSON"),
    ],
    async function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Error", errors: errors.array() });
        }
        const notification = await db.Notification.create(req.body);
        expressWs.getWss("/socket").clients.forEach((client) => {
            client.send(JSON.stringify(notification));
        });
        res.status(200).send({
            status: "OK",
            data: notification,
        });
    }
);

app.ws("/", socketSecurity, function (ws, req) {
    ws.send(
        JSON.stringify({
            status: "OK",
            message: "Websocket Connected!",
        })
    );
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port", process.env.PORT || 3000);
});
