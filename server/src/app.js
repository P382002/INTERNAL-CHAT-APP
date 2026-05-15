require("dotenv").config();

const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const authRoutes =
  require("./routes/authRoutes");

const groupRoutes =
  require("./routes/groupRoutes");

const userRoutes =
  require("./routes/userRoutes");

const messageRoutes =
  require("./routes/messageRoutes");

const app =
  express();


// MIDDLEWARE
app.use(cors());

app.use(express.json());


// ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/groups",
  groupRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);


// TEST ROUTE
app.get(
  "/",
  (req, res) => {

    res.send(
      "Server Running"
    );
  }
);


// MONGODB CONNECTION
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {

    console.log(
      "MongoDB Connected"
    );
  })
  .catch((err) => {

    console.log(err);
  });

module.exports =
  app;