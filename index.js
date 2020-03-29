const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  { name: "Patricia Lebsack", number: "493-170-9623 156", id: 1234567 },
  { name: "Ervin Howell", number: "010-692-6593 09125", id: 2456789 },
  { name: "Leanne Graham", number: "1-770-736-8031 56442", id: 34567890 },
  { name: "Julianne O'Connel", number: "491-179-8623 256", id: 45678901 },
  { name: "Ada Lovelace", number: "493-170-9623 156", id: 56789012 }
];

const generateId = () => {
  return Math.floor(Math.random() * 100000000);
};

app.get("/api/persons", (request, response) => {
  return response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing"
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "The name already exists in the phonebook"
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/info", (request, response) => {
  const numberOfEntries = persons.length;
  return response.send(
    `
<div>Phonebook has info for ${numberOfEntries} people</div>
<div>${new Date()}</div>
    `
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
