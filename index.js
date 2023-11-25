const express=require("express");
const bodyParser = require("body-parser");
const blogPostarray = require("./data");
const mongoose = require("mongoose")
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended:true}));

const MONGODB_URL = process.env.MONGO_URL;
mongoose.connect(MONGODB_URL)
.then(()=>{
    console.log("Database connected !")

})
.catch(()=>{
    console.log("error occured at db connection!",err);

});

const blogSchema = new  mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    imageURL : String,
    discription : String
})


const Blog = new mongoose.model("blog",blogSchema);

app.get("/",(request, response)=>{

    Blog.find({})
    .then((arr)=>{
        response.render("index",{blogPostarray:arr});
    
    })
    .catch(()=>{
        console.log("Can not find Blogs!")
        response.render("404")
    });
  
})



app.get("/contact",(request,response)=>{

    response.render("contact");
})

app.get("/about",(request,response)=>{

    response.render("about");
})

app.get("/compose",(request,response)=>{

    response.render("compose");
})

app.post("/compose", (req,res)=>{

    //const newID = blogPostarray.length + 1;
   const title =  req.body.title;
   const image =  req.body.imageUrl;
   const discription = req.body.description;

   const newBlog = new Blog({
    imageURL : image,
    title : title,
    description : discription

   })

   newBlog.save()
   .then(()=>{
       console.log("Blog Posted !")
   })
   .catch(()=>{
       console.log("Not posted !")
   })

   res.redirect("/")
})



app.get("/post/:id",(request,response)=>{
    console.log(request.params.id);

    const id = request.params.id;
    const title = "";
    const imageURL = "";
    const discription = "";

    blogPostarray.forEach((post)=>{
        if(post._id==id){
            response.render("post",{post : post});
        }
       
    });
    
})

const port = 3000 || process.env.PORT;

app.listen(port,()=>{
    console.log("Server is Listening in port 3000 http://localhost:3000");
})