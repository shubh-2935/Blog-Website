const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const  ObjectID = require('mongodb').ObjectId;
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const mongcon = mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connected");
  }
  catch (err) {
    console.log(err);
  }
}

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Blog = mongoose.model("Blog", blogSchema);

const homeStartingContent = "Welcome to Explore Ancient Civilizations, a blog website dedicated to unraveling the mysteries and wonders of the world's ancient cultures. Embark on a captivating journey through time as we delve into the captivating histories of various countries and civilizations, including Egypt, Greece, China, and many more. Our blog features meticulously researched articles, fascinating insights, and captivating stories that bring ancient civilizations to life. Whether you are a history enthusiast, a curious traveler, or simply intrigued by the marvels of the past, our website is your gateway to exploring the captivating world of ancient cultures. Join us on this remarkable expedition as we uncover the secrets and legacies of ancient civilizations that have shaped our present and continue to inspire us today.";
const aboutContent = "Welcome to Explore Ancient Civilizations, a blog website dedicated to unraveling the mysteries and wonders of the world's ancient cultures. Embark on a captivating journey through time as we delve into the captivating histories of various countries and civilizations, including Egypt, Greece, China, and many more. Our blog features meticulously researched articles, fascinating insights, and captivating stories that bring ancient civilizations to life. Whether you are a history enthusiast, a curious traveler, or simply intrigued by the marvels of the past, our website is your gateway.";
const contactContent = "Our team at Explore Ancient Civilizations is thrilled to hear from you. If you have any questions, suggestions, or feedback, please don't hesitate to reach out to us. We value your input and are committed to providing you with the best possible experience.";

app.get("/", async (req, res) => {

  try {
    const posts = await Blog.find();
    res.render("home", { homeContent: homeStartingContent, postArray: posts });
  } catch (err) {
    console.log(err);
  }

})

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
})

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
})

app.get("/compose", function (req, res) {
  res.render("compose");
})


app.post("/compose", async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.postTitle,
      content: req.body.postBody
    })
    await blog.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

})

app.get("/posts/:postId", async (req, res) => {
  try {

    const id = req.params.postId;

    const post = await Blog.findById(id);
    res.render("post", { separateTitle: post.title, separateContent: post.content });

  } catch (err) {
    console.log(err);
  }

})



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Listening on port");
  })
})