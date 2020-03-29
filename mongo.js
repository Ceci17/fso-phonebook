const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://ceci:${password}@cluster0-2waa6.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Contact = new mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  Contact.find({}).then(contact => {
    console.log("phonebook:");
    contact.map(c => console.log(`${c.name} ${c.number}`));
    mongoose.connection.close();
  });
  return;
}

const contact = new Contact({
  name,
  number
});

contact.save().then(response => {
  console.log(`Added ${name} number ${number} to phonebook`);
  mongoose.connection.close();
});
