module.exports.getDate=function(){
    const today = new Date();
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const currentDate = today.toLocaleDateString("en-US", options);
    return currentDate;
};