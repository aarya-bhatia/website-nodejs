require("dotenv").config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const path = require("path");
const os = require("os");

const {sendEmail} = require("./email");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.render("index");
});

app.get('/contact', function (req, res) {
  res.render("contact");
});

app.post('/contact', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  if (!name || !email || !message) {
    return res.render("contact", params = {"message": "Please fill in all fields.", "status": "FAILURE"})
  }

  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const hostname = os.hostname();
  const payload = {name, email, message, date, time};
  const template = path.join(__dirname, "templates/notification.ejs");

  // Send message to personal email
  sendEmail("aarya.bhatia1678@gmail.com",
    subject = `${hostname}: You received a message from ${name}`, payload, template)

  // Send email confirmation to receiver
  sendEmail(email,
    subject = `${hostname}: Your message has been sent!`, payload, template)

  // TODO: Append message to file

  return res.render("contact", params = {"message": "Your message has been sent! You will get a confirmation on your email when the message is delivered.", "status": "SUCCESS"})
});

app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// start listening on port
app.listen(PORT, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    PORT,
    app.settings.env
  );
});

