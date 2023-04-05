var express = require("express");
var app = express();
var http = require("http");
var path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
const { v4: uuidv4 } = require("uuid");

// CREAYE SERVER ON PORT 300
var port = process.env.PORT || 3000;
var server = http.createServer(app);
server.listen(port, function () {
  console.log(`app chal raha hai on port : ${port}`);
});
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);




// AUTHENTICATION CONFIG-----------
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSession = require("express-session");
var passport = require("passport");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const LocalStrategy = require("passport-local").Strategy;

mongoose.connect("mongodb://127.0.0.1:27017/videochatapp").then(function () {
  console.log("conectedddddd.........!");
});

var userModel = mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

userModel.plugin(passportLocalMongoose);


var Users = mongoose.model("user", userModel);

passport.use(new LocalStrategy(Users.authenticate()));


app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "lolo",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


// app.get("/", (req, res) => {
//   res.render("rs");
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });
// app.get("/profile", (req, res) => {
//   res.send("profile>>>> !!")
// });

// app.post("/register", (req, res) => {
//   var userdets = new Users({
//     username: req.body.username,
//     email: req.body.email,
//   });
//   Users.register(userdets, req.body.password).then(function (u) {
//     passport.authenticate("local")(req, res, function () {
//       res.send("successfullyyy........");
//     });
//   });
// });

// app.post("/login", isRedirected, passport.authenticate("local", {
//     successRedirect: "/profile",
//     failureRedirect: "/login",
//   }),
//   function (req, res, next) {}
// );


// app.get("/logout", function (req, res, next) {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });


// Authenticate user Login
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }
// function isRedirected(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.redirect("/profile");
//   } else {
//     return next();
//   }
// }


// AUTH ROUTES ---------------------END


io.on("connection", function (socket) {
  console.log("A user connected");
  socket.on("disconnect", function () {
    console.log(" Diss.....!");
  });
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    console.log(`this is roomid ${roomId}`);
    console.log(`this is userid ${userId}`);

    socket.on("msg", (msg) => {
      // console.log(msg)
      io.to(roomId).emit("create-msg", msg);
    });
  });
});


/* GET home page. */

app.get("/" , function (req, res, next) {
  // res.render('index');
  res.redirect(`/${uuidv4()}`);
});


app.get("/:room", function (req, res, next) {
  res.render("index", { roomId: req.params.room });
  // console.log(req.params.room)
});
