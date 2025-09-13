import express from "express";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;


// --- MULTER CONFIGURATION ---
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: './public/uploads/', // The folder where files will be saved
  filename: function(req, file, cb){
    // Create a unique filename to prevent overwriting
    cb(null, 'video-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/edit", (req, res) => {
  res.render("edit.ejs");
});
app.get("/blogs", (req, res) => {
  res.render("blogs.ejs", { blogs: blogs });
});

// GET route to show the edit form for a specific post
app.get('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const blogToEdit = blogs.find(blog => blog.id === postId);

  if (blogToEdit) {
    res.render('edit', { blog: blogToEdit }); // Render a new 'edit.ejs' view
  } else {
    res.redirect('/'); // Or show a 404 error
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

let blogs = [];
let nextId = 1;
app.post("/upload", upload.single('userVideo'), (req, res) => {
  const newBlog = {
  id: nextId++,
  author: req.body.userName,
  title: req.body.blogTitle,
  videoFilename: req.file.filename,
  createdAt: new Date()

   };

   blogs.unshift(newBlog);

   console.log('New blog post added: ', blogs);
   res.redirect('/');
});

// POST route to handle the updated post data
app.post('/update/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const blogIndex = blogs.findIndex(blog => blog.id === postId);

  if (blogIndex !== -1) {
    // Update the data for the blog at that index
    blogs[blogIndex].author = req.body.userName;
    blogs[blogIndex].title = req.body.blogTitle;
  }

  res.redirect('/'); // Redirect back to the homepage to see the change
});

// POST route to delete a post
app.post('/delete/:id', (req, res) => {
  const postId = parseInt(req.params.id);

  // Re-assign the blogs array to a new array that excludes the deleted post
  blogs = blogs.filter(blog => blog.id !== postId);

  res.redirect('/'); // Redirect back to the homepage
});

