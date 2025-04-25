const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(express.json());
app.use(cors());
morgan.token('body', function (request) {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (_, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (_, response) => {
  response.json(phonebook);
});

app.get('/api/info', (_, response) => {
  response.send(
    `<p>Phonebook has info for ${
      phonebook.length
    } people </p><p>${new Date()}</p>`
  );
});

app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id;
  const phone = phonebook.find(phone => phone.id === id);

  if (phone) {
    response.send(phone);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  phonebook = phonebook.filter(phone => phone.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const newId =
    phonebook.length > 0 ? Math.max(...phonebook.map(p => Number(p.id))) : 0;
  return String(newId + 1);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      statusCode: 400,
      error: 'name or content missing',
    });
  }

  if (!!phonebook.find(phone => phone.name === body.name)) {
    return response.status(409).json({
      statusCode: 409,
      error: 'name must be unique',
    });
  }

  const phone = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  phonebook = phonebook.concat(phone);
  response.json(phone);
});

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
