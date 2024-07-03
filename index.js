import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", {
    posts: posts,
  });
});

app.get("/posts/:id", (req, res) => {
  const post = posts.find((x) => x.id == req.params.id);
  res.render("post.ejs", {
    post: post,
  });
});

// create post
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/submit", upload.single("image"), (req, res) => {
  function formatDate(date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    return `${months[monthIndex]} ${day}, ${year}`;
  }

  posts.push({
    id: posts.length,
    title: req.body.title,
    date: formatDate(new Date()),
    author: req.body.author,
    image: req.file ? `/images/${req.file.filename}` : "/images/ny-skyline.jpg",
    description: req.body.description,
  });
  res.redirect("/");
});

// edit post
app.get("/edit/:id", (req, res) => {
  const post = posts.find((x) => x.id == req.params.id);
  res.render("edit.ejs", {
    post: post,
  });
});

app.post("/update/:id", upload.single("image"), (req, res) => {
  const post = posts.find((x) => x.id == req.params.id);
  post.author = req.body.author;
  post.title = req.body.title;
  post.description = req.body.description;
  if (req.file) {
    post.image = `/images/${req.file.filename}`;
  }
  res.redirect(`/posts/${req.params.id}`);
});

// delete post
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((x) => x.id == req.params.id);
  posts.splice(index, 1);
  res.redirect("/");
});

app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}...`);
});

let posts = [
  {
    id: 0,
    title: "Our Day at the Mall",
    date: "June 7, 2024",
    author: "Arnold Khublall",
    image: "/images/nj-mall.jpg",
    description:
      "Today, I had an amazing time at the mall with my girlfriend. We started off with coffee and pastries at our favorite café, chatting and laughing over the latest trends. Wandering through stores, we tried on clothes, debated over shoes, and found the perfect accessories. The highlight was visiting the bookstore, where we picked out a couple of novels to enjoy together. We wrapped up our day with a delicious meal at the food court, sharing bites and stories. It was a simple day, but spending it with my girlfriend made it unforgettable.",
  },
  {
    id: 1,
    title: "Beach Day",
    date: "July 1, 2024",
    author: "Rachel Gapasin",
    image: "/images/nj-beach.webp",
    description:
      "Today was a perfect day at the beach with my boyfriend. We started with a morning walk along the shore, the cool breeze and warm sun making everything feel magical. We built a sandcastle together, laughing as the waves tried to claim it. After a swim in the refreshing ocean, we relaxed on our towels, sharing snacks and enjoying each other’s company. As the sun began to set, we strolled hand-in-hand, taking in the stunning colors of the sky. It was a day full of love, laughter, and beautiful memories. I couldn't have asked for a better day.",
  },
];
