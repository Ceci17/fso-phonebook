require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Contact = require("./models/contact");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (request, _) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (_, response, next) => {
  Contact.find({})
    .then(contact => response.json(contact))
    .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(contact => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing"
    });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  });

  contact
    .save()
    .then(savedContact => savedContact.toJSON())
    .then(formattedContact => response.json(formattedContact))
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const contact = {
    name: body.name,
    number: body.number
  };

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => updatedContact.toJSON())
    .then(formattedContact => response.json(formattedContact))
    .catch(error => next(error));
});

app.get("/api/info", async (_, response, next) => {
  const numberOfContacts = await Contact.count({});
  return response.send(
    `
<div>Phonebook has info for ${numberOfContacts} people</div>
<div>${new Date()}</div>
    `
  );
});

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, _, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
