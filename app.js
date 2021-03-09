const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to our todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];



app.get("/", (req, res) => {

    //let day = getDate();

    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Item added succesfully")
                }
            res.redirect("/");
            });
        } else {
            res.render("list", {
                listTitle: "Today",
                newItems: foundItems
            });
        };
    });
});

app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work List", 
        newItems: workItems
    });
});

app.post("/", (req, res) => {

    let itemName = req.body.newItem;

    const item = new Item ({
        name: itemName
    });

    item.save();
    res.redirect("/")
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Item " + checkedItemId + " removed from the list");
            res.redirect("/");
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, () => {
    console.log("Running on port 3000")
});