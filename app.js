var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
	flash           = require("connect-flash"),
	methodOverride  = require("method-override"),
	Campground      = require("./models/campground"),
	Comment         = require("./models/comment"),
	User            = require("./models/user"),
    passport        = require("passport"),
	localStrategy   = require("passport-local"),
	seedDB          = require("./seeds");

//ROUTES REQUIRED
var campgroundRoutes  = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    indexRoutes        = require("./routes/index");

const mongoose = require('mongoose');

//FOR USING mongoDB Atlas
mongoose.connect('mongodb+srv://kapil:opc107@yelpcampdb.0zt0i.mongodb.net/YelpCampDb?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log('Error:', err.message);
});

//FOR USING LOCAL mongodb
/*const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

//seedDB(); //To Seed The DB

//PASSWORD CONFIG
app.use(require("express-session")({
	secret: "Once again rusty wins",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());   
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//TO PASS currentUser & flash message TO EVERY TEMPLATE (.ejs files)//
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

/*app.listen(3000, function(){
	console.log("YelpCamp server listening on port 3000");
});*/ //for running on local server 

app.listen(process.env.PORT, process.env.IP); //for running on heroku