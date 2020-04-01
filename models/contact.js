const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

console.log(`Conntecting to ${url}`);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(result => console.log("Connected to MongoDB"))
  .catch(error => console.log(`Error connecting to DB: ${error.message}`));

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  number: {
    type: String,
    unique: true,
    required: true
  }
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

contactSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Contact", contactSchema);
