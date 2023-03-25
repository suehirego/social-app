const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
      username: {type: String, required: true, unique: true, min: 3, max: 20},
      firstname: {type: String, max: 50},
      lastname: {type: String, max: 50},
      email: {type: String, required: true, max: 50, unique: true},
      password: {type: String, required: true, min: 6},
      profilePic: {type: String, default: ""},
      coverPic: {type: String, default: ""},
      followers: {type: Array, default: []},
      followings: {type: Array, default: []},
      tagline: {type:String, max:50},
      jobTitle: {type:String, max:50},
      employer: {type:String, max:50},
      school: {type:String, max:50},
      city: {type:String, max:50},
      isAdmin: {type: Boolean, default:false},
},
      {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);
