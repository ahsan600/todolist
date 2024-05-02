const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://ahsan600:Ahsanx874@cluster0.xnlggjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/toDoListDB"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });
const ListScheme = new mongoose.Schema({
  name: String,
});
const customListScheme = new mongoose.Schema({
  name: String,
  item: [ListScheme],
});
const toDoList = mongoose.model("ToDoList", ListScheme);
const List = mongoose.model("List", customListScheme);
module.exports = {
  toDoList,
  List,
};
