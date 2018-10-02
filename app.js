var express = require ('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// APP CONFIG
mongoose.connect('mongodb://localhost/restful_reminder_app', {useNewUrlParser: true});

// MONGOOSE/MODEL CONFIG
var reminderSchema = new mongoose.Schema({
    title: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Reminder = mongoose.model("Reminder", reminderSchema);

// I am going to make a commit using lazygit function

// Reminder.create({
//     title: "Finish Elec 301 Mini-Project",
//     body: "This is an individual project that explores the semantics and nature of circuits."
// }, function(err, createdReminder) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(createdReminder);
//     }
// })

// RESTFUL ROUTES

// INDEX
app.get('/', function(req, res){
    res.redirect("/reminders");
})

// REAL INDEX
app.get('/reminders', function(req,res){
    Reminder.find({}, function(err, remindersFound) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {reminders: remindersFound});
        }
    })
})

app.listen(port,console.log("Reminder server is running!"));
