var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
var http = require("http");
var path = require("path");

var port = 4000;
app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.get("/test", (req, res) => {
  res.send("Server is running");
});
app.use(express.static(path.resolve(__dirname, "public")));
const server = http.createServer(app);
require("./socket")(server);

server.listen(port, () => {
  console.log("Server is running on port http://localhost:" + port);
});
