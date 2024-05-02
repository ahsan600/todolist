const express = require("express");
const bodyParser = require("body-parser");
const { toDoList, List } = require("./connection.js");
const { defaultData } = require("./database.js");
const date = require(__dirname + "/data.js");
const app = express();
const lodash = require("lodash");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
let currentDate = date.getDate();
app.get("/", (req, res) => {
  toDoList.find({}).then((result) => {
    if (result.length === 0) {
      toDoList.insertMany(defaultData);
      res.redirect("/");
    } else {
      res.render("index", { titleName: currentDate, dataList: result });
    }
  });
});
app.post("/", (req, res) => {
  const listname = req.body.button;
  const newItem = req.body.newItem;
  const insertData = new toDoList({
    name: newItem,
  });
  if (listname == currentDate) {
    insertData.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listname })
      .then((result) => {
        result.item.push(insertData);
        result.save();
        res.redirect("/" + listname);
      })
      .catch((e) => {
        console.log(e);
      });
  }
});
app.post("/delete", (req, res) => {
  let deleteItem = req.body.checkbox;
  let deleteItemTitle = req.body.listname;

  if (deleteItemTitle == currentDate) {
    toDoList
      .findByIdAndDelete({ _id: deleteItem })
      .then(() => {
        // Check if all items have been deleted from the current date list
        toDoList.find({}).then((result) => {
          if (result.length === 0) {
            // If all items are deleted, re-insert default data
            toDoList.insertMany(defaultData);
          }
          setTimeout(() => {
            res.redirect("/");
          }, 300);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    List.findOneAndUpdate(
      { name: deleteItemTitle },
      { $pull: { item: { _id: deleteItem } } }
    )
      .then(() => {
        // Check if all items have been deleted from the custom list
        List.findOne({ name: deleteItemTitle }).then((result) => {
          if (result.item.length === 0) {
            // If all items are deleted, re-insert default data
            result.item.push(...defaultData);
            result.save();
          }
          res.redirect("/" + deleteItemTitle);
        });
      })
      .catch((e) => {
        console.log(e);
        res.redirect("/");
      });
  }
});

app.get("/:topic", (req, res) => {
  const customName = lodash.capitalize(req.params.topic);
  List.findOne({ name: customName })
    .then((result) => {
      if (!result) {
        const newlist = new List({
          name: customName,
          item: defaultData,
        });
        newlist
          .save()
          .then(() => {
            res.redirect("/" + customName); // Redirect to the route handler for the customName
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        if (result.item.length === 0) {
          result.item.push(...defaultData);
          result.save();
        }
        res.render("index", {
          titleName: result.name,
          dataList: result.item,
        });

        // Render the view without a leading slash
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Running");
});
