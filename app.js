//jshint esversion:6
//requiring express (npm i express)n,which will be used for setting up the server
const express = require("express");
//body parser is a module that  wil be used to fetch the data from the form to our page.
const bodyParser = require("body-parser");
//ejs is templating service that we will use (npm i ejs) then require then "app.set('view engine', 'ejs');""
const ejs = require("ejs");
//mongoose is required to connect mongodb to our nodejs.
const mongoose = require('mongoose');
//here some already existing content has been cretaed.
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
//we created a app using express ,which will help setting port:3000 and also to make routes.
const app = express();
//this one is for telling that we are using ejs
app.set('view engine', 'ejs');
//formalities associated with body parser
app.use(bodyParser.urlencoded({extended: true}));
//we are telling that all the static files will be avaialble insid the  folder anme public.
app.use(express.static("public"));
//we are connecting nodejs application to mongodb using our mongoose
mongoose.connect("mongodb+srv://admin-harsh:Test123@cluster0.whpfi.mongodb.net/blogDB", {useNewUrlParser: true});
//we have defined a schema for the data to be stored  in our mongodb dabatabse
const postSchema = {
  title: String,
  content: String
};
//we have created a model using the schema available and the 2nd "Post" is singluar form of the name of the collection made inside our mongodb db
const Post = mongoose.model("Post", postSchema);
//to out "/" we are sending starting content which we have as variable adn other posts that are avaialble in our database.
app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    //home here is home.ejs avaialble  in views folder
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});
//in /compose we will render the file name "compose.ejs"
app.get("/compose", function(req, res){
  res.render("compose");
});

//inside compose.ejs we have a form ,whose data wil be recieved using post method and after reciveing ,document using "Post" model would be created
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

//the document "post" that was cretaed in above step is saved now. and we are redirected top the home page.
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});


//here we are sending id specific data to the post.ejs and we are sending title and content of that post after finding through model "Post"
app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

// /about page has some content to be shown already decided.
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
//we have setttuped the post to be listened ,both for heroku as well as localhost
app.listen(process.env.PORT||3000, function() {
  console.log("Server started OVER HEROKU");
});
