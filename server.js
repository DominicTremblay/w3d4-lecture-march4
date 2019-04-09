const express = require('express');
const morgan = require('morgan');
const Mongo = require('mongodb');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 8000;
const app = express();
const MongoClient = Mongo.MongoClient;

// URL to connect to the mongoDB, default port 27017 on localhost
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movieQuotes';

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Have a db instance in the global scope
let db = null;

// Establish connection to the mongo db and assign the mongoDb object to db
MongoClient.connect(MONGODB_URI, (err, mongoDb) => {
  if (err) {
    console.log('Cannot connect to MongoDB:', err);
    process.exit(1);
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  // assign mongoDB (database instance) to the global db variable
  db = mongoDb;
});

// Create the routes to respond to request

// Get the quote list from the database

app.get('/quotes', (req, res) => {
  // creating the query to get all the quotes from mongo db
  // request is asynchronous

  db.collection('quotes')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(error => res.send(error));
});

// Creating a post route to create a new quote

app.post('/quotes', (req, res) => {
  // extract the content from que request
  const { quote } = req.body;
  console.log(req.body);
  // Crating the structure of the data that needs to be inserted into the database
  const quoteObj = {
    quote: quote,
    comments: [],
  };

  console.log(quoteObj);
  // create an insert query
  db.collection('quotes')
    .insertOne(quoteObj)
    .then(response => res.json(quoteObj))
    .catch(err => res.send(err));
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
