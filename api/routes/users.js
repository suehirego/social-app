const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


//# UPDATE  USER #//
router.put("/:id", async (req, res) => {

      if (req.body.userId === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                  try {
                        const salt = await bcrypt.genSalt(10);
                        req.body.password = await bcrypt.hash(req.body.password, salt);

                  } catch (err) {
                        return res.status(500).json(err);
                  }
            }

            try {
                  const user = await User.findByIdAndUpdate(req.params.id, {
                        $set: req.body,
                  });
                  res.status(200).json("Account has been updated!");

            } catch (err) {
                  res.status(500).json(err);
            }

      } else {
            return res.status(401).json("You can only update your account!")
      }
});



//# DELETE  USER #//
router.delete("/:id", async (req, res) => {

      if (req.body.userId === req.params.id || req.body.isAdmin) {

            try {
                  const user = await User.findByIdAndDelete(req.params.id);
                  res.status(200).json("Account has been deleted!");

            } catch (err) {

                  res.status(500).json(err);
            }


      } else {
            return res.status(401).json("You can only delete your account!")
      }
})


//# GET  USER #// ***use both userId and username
router.get("/", async (req, res) => {
      const userId = req.query.userId;
      const username = req.query.username;

      try {
            //write a condition for finding user either by userId or username
            const user = userId
                  ? await User.findById(userId)
                  : await User.findOne({ username: username });

            // select what user info to return
            const { password, updatedAt, ...others } = user._doc
            res.status(200).json(others);

      } catch (err) {
            res.status(500).json(err);
      }
});

//GET ALL USERS
router.get("/all", async (req, res) => {
      const query = req.query.new;
      try {
            const users = query
                  ? await User.find().sort({ _id: -1 }).limit(10)
                  : await User.find();
            res.status(200).json(users);
  
      } catch (err) {
          res.status(500).json(err);
      }
  
});

router.get("/friends/:userId", async (req, res) => {
      try {
            const user = await User.findById(req.params.userId);
            const friends = await Promise.all(
                  user.followings.map((friendId) => {
                        return User.findById(friendId);
                  })
            );
            let friendList = [];
            friends.map((friend) => {
                  const { _id, username, firstname, lastname, profilePic } = friend;
                  friendList.push({ _id, username, firstname, lastname, profilePic });
            });
            res.status(200).json(friendList)
      } catch (err) {
            res.status(500).json(err);
      }
});


//# FOLLOW USER #//
router.put("/:id/follow", async (req, res) => {
      // first check if the users are the same....if so "you can not follow yourself"
      if (req.body.userId !== req.params.id) {

            try {

                  // check if the currentUser(the one sending the request)and user are following echother; 
                  // if not, then update the followers and followings arrays
                  const user = await User.findById(req.params.id);
                  const currentUser = await User.findById(req.body.userId);

                  if (!user.followers.includes(req.body.userId)) {

                        await user.updateOne({ $push: { followers: req.body.userId } });
                        await currentUser.updateOne({ $push: { followings: req.params.id } });

                        res.status(200).json("user has been followed!")

                  } else {
                        res.status(402).json("You already follow this user!")
                  }


            } catch (err) {
                  res.status(500).json(err);
            }

      } else {

            res.status(403).json("You can not follow yourself!");
      }
})

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
      if (req.body.userId !== req.params.id) {
            try {
                  const user = await User.findById(req.params.id);
                  const currentUser = await User.findById(req.body.userId);
                  if (user.followers.includes(req.body.userId)) {
                        await user.updateOne({ $pull: { followers: req.body.userId } });
                        await currentUser.updateOne({ $pull: { followings: req.params.id } });
                        res.status(200).json("user has been unfollowed");
                  } else {
                        res.status(403).json("you dont follow this user");
                  }
            } catch (err) {
                  res.status(500).json(err);
            }
      } else {
            res.status(403).json("you cant unfollow yourself");
      }
});


module.exports = router;