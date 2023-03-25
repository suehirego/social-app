const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("CONNECTED TO MongoDB!"))
.catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(morgan("common"));
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions));


//Testing routes
app.get("/", (req, res) => {
  res.json("Welcome to the META-INSPO API (A social media app inspired by Facebook) !")
});

//routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);


app.listen(process.env.PORT || 4000, () => {
  console.log("Backend server is running")
});