const mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//USER SCHEMA
var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;