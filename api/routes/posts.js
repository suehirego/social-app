const Post = require("../models/Post");
const User = require("../models/User");
const router = require("express").Router();

//# CREATE POST #//
router.post("/", async (req, res) => {

      const newPost = new Post(req.body)
      try{
            const savedPost = await newPost.save();
            res.status(200).json(savedPost);
      }catch(err){
            res.status(500).json(err);
      }
});


//# UPDATE POST #//
router.put("/:id", async (req,res) => {
     
      try{

            const post = await Post.findById(req.params.id);
            if(post.userId === req.body.userId){

                  await post.updateOne({ $set: req.body});
                  res.status(200).json('Post has been updated')

            }else{
                  res.status(401).json("You can only update your post!")
            }

      }catch(err){
            res.status(500).json(err);
      }
})


//# DELETE POST #//
router.delete("/:id", async (req,res) => {
      try{
            const post = await Post.findById(req.params.id);
            if(post.userId === req.body.userId){

                  await post.deleteOne();
                  res.status(200).json('Post has been deleted')

            }else{
                  res.status(401).json("You can only delete your post!")
            }

      }catch(err){
            res.status(500).json(err);
      }
})

//# LIKE POST #//
router.put("/:id/like", async (req, res) => {
       
      try{

            const post =  await Post.findById(req.params.id);
            //check if the user has already liked the post....do they appear in the "like array"
            if(!post.likes.includes(req.body.userId)) {
                  await post.updateOne({ $push: {likes: req.body.userId} });
                  res.status(200).json("The post has been liked")

            }else{
                  await post.updateOne({ $pull: {likes: req.body.userId} });
                  res.status(200).json("Like withdrawn!")

            }

      }catch(err){
            res.status(500).json(err);
      }

});

//# GET POST #//
router.get("/:id", async (req, res) => {

      try{

            const post = await Post.findById(req.params.id);
            res.status(200).json(post);

      } catch(err){
            res.status(500).json(err);
      }

});

//# GET ALL POSTS OF USER'S FOLLOWINGS #// timeline
router.get("/timeline/:userId", async (req, res) => {
      try{
            //find current user
            const currentUser = await User.findById(req.params.userId);
            //add all posts of the current user to the posts array
            const userPosts = await Post.find({userId: currentUser._id});
            //add all posts of current user's friends or followings
            const friendPosts = await Promise.all(

                  currentUser.followings.map((friendId) => {
                     return    Post.find({ userId: friendId });
                  })

            );
            res.status(200).json(userPosts.concat(...friendPosts));


      } catch(err){
            res.status(500).json(err);
      }


});

// Get all posts for only one user // profile
router.get("/profile/:username", async (req, res) => {

      try{
            const user = await User.findOne({username: req.params.username})
            const posts = await  Post.find({userId: user._id});
            res.status(200).json(posts);

      } catch(err){
            res.status(500).json(err);
      }


});


module.exports = router;