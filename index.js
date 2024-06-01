import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid'; // Add this line at the top of your file


const port = 3000;
const app = express();

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the static files directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static('images'));

app.use(bodyParser.urlencoded({ extended: true }));

let nameList = [];
let titleList = [];
let blogList = [];
let blogs = [];


// Set the view engine to ejs
app.set('view engine', 'ejs');

// Define the route
app.get('/', (req, res) => {
    let currYear = new Date().getFullYear();
    res.render('intro', { year: currYear });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/create', (req, res) => {
    let currYear = new Date().getFullYear();
    res.render('create', { year: currYear });
});

app.post('/create', (req, res) => {
    const { name, title, blog } = req.body;

    const newBlog = {
        id: uuidv4(),
        name,
        title,
        blog
    };

    blogs.push(newBlog);
    res.redirect('/create');
});

app.get('/view', (req, res) => {
    let currYear = new Date().getFullYear();
    res.render('view', { year: currYear,blogs: blogs});
});
app.get('/update/:id', (req, res) => {
    const blogId = req.params.id;
    const blog = blogs.find(blog => blog.id === blogId);

    if (blog) {
        res.render('update', { blog, year: new Date().getFullYear() });
    } else {
        res.status(404).send('Blog not found');
    }
});
app.post('/update/:id', (req, res) => {
    const blogId = req.params.id;
    const { name, title, blog } = req.body;

    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    if (blogIndex !== -1) {
        blogs[blogIndex] = { id: blogId, name, title, blog };
        res.redirect('/view');
    } else {
        res.status(404).send('Blog not found');
    }
});
app.post('/delete/:id',(req,res)=>{
    const blogId=req.params.id;
    const blogIndex=blogs.findIndex(blog=> blog.id===blogId);
    if(blogIndex!== -1){
        blogs.splice(blogIndex,1);
        res.redirect('/view');
    }
    else{
        res.status(404).send('Blog not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
