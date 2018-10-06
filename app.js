var express = require ('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var methodOverride = require('method-override')
var expressSanitizer = require('express-sanitizer')
var port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// Command used to change post to put/delete since forms can't handle it
app.use(methodOverride("_method"));

// APP CONFIG
mongoose.connect('mongodb://localhost/restful_reminder_app', {useNewUrlParser: true});

// MONGOOSE/MODEL CONFIG
var reminderSchema = new mongoose.Schema({
    title: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Reminder = mongoose.model("Reminder", reminderSchema);

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

// REAL INDEX: This is where you retrieve your information from, and render it in the index html file
app.get('/reminders', function(req,res){
    Reminder.find({}, function(err, remindersFound) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {reminders: remindersFound});
        }
    })
})

// NEW
app.get('/reminders/new', function(req, res) {
    res.render('new');
})

// CREATE
app.post('/reminders', function(req,res) {
    // Create reminder
    req.body.reminder.body = req.sanitize(req.body.reminder.body);
    Reminder.create(req.body.reminder, function(err, newReminder) {
        if(err) {
            res.render("new");
        } else {
            // redirect to /reminders
            res.redirect('/reminders');
        }
    })
})

// SHOW
app.get('/reminders/:id', function(req,res) {
    Reminder.findById(req.params.id, function(err, foundReminder) {
        if (err) {
            res.render("/reminders");
        } else {
            res.render("show", {reminder: foundReminder});
        }
    })
})

// EDIT 
app.get('/reminders/:id/edit', function(req, res) {
    Reminder.findById(req.params.id, function(err, reminderFound) {
        if (err) {
            res.redirect('/reminders');
        } else {
            res.render('edit', {reminder:reminderFound});
        }
    })
}) 

// UPDATE
app.put('/reminders/:id', function(req, res) {
    req.body.reminder.body = req.sanitize(req.body.reminder.body);
    Reminder.findByIdAndUpdate(req.params.id, req.body.reminder, function (err, updatedReminder){
        if (err) {
            res.redirect("/reminders");
        } else {
            res.redirect("/reminders/" + req.params.id);
        }
    }) 
})

// DELETE
app.delete('/reminders/:id', function(req, res) {
    Reminder.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/reminders");
        } else {
            res.redirect("/reminders");
        }
    })
})

app.listen(port,console.log("Reminder server is running!"));
