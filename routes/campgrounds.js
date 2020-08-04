var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//=================================================================
//CAMPGROUND ROUTES
//=================================================================

//INDEX RESTful route to - show all the campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log("SOMETHING WENT WRONG!!");
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});


//CREATE RESTful route to - add new campground to the DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
	var price = req.body.price;
    var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
    var newCampground = {name: name, price: price, image: image, description: description, author: author}
    //create a new campground and then save it to the DB
	Campground.create(newCampground, function(err, newlyCreatedCampground){
		if(err){
			console.log("SOMETHING WENT WRONG!!");
			console.log(err);
		} else{
			//redirect back to campgrounds page
            res.redirect("/campgrounds");
		}
	});
});

//NEW RESTful route to - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW RESTful route to - show complete info about one campground
router.get("/:id", function(req, res){
	//find the campground with the provided ID
	//either use req.params.id or
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgroundId){
		if(err){
			console.log("SOMETHING WENT WRONG!!");
			console.log(err);
		} else{
			//render show template with that campground
	        res.render("campgrounds/show", {campground: foundCampgroundId});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//Find & update the correct campground and redirect somewhere
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY or DELETE CAMPGROUND ROUTE 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			req.flash("success", "Campground deleted successfully.");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;