const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


//## REGISTER ##//
router.post("/register", async (req,res) => {

      try{

            //encrypt password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
             
            //create new user
            const newUser = new User({
                  username: req.body.username,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  email: req.body.email,
                  password: hashedPassword,
            });
      
            //save user and return response
            const user = await newUser.save();
            res.status(200).json(user);

      }catch(err){
            res.status(500).json(err);
      }
      
});


//## LOGIN ##//
router.post("/login",  async(req, res) => {

      try{
            user = await User.findOne({email:req.body.email});
            !user && res.status(401).json("User not found")

            // Decrypt password
            const validated = await bcrypt.compare(req.body.password, user.password);
            !validated && res.status(400).json("Wrong Password!");

            res.status(200).json(user);

      } catch(err){
            res.status(500).json(err);
      }

});


module.exports = router;