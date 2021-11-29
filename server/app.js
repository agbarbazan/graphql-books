const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose')
const cors = require('cors');

const app = express();

//allow cross-origin requests
app.use(cors());

//connect to mlab database
mongoose.connect("mongodb+srv://agbarbazan:gql123!@gql-db.xltvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
//event listener that listens for open connection
mongoose.connection.once('open', () => {
  console.log('Connected to database');
})
//used whenever a request to graphql endpoint comes in
app.use('/graphql', graphqlHTTP({
  //takes in options 
  schema, //from line 3
  graphiql: true //use graphiql tool to test out queries
}));

app.listen(4000, () => {
  console.log('Now listening for requests on port 4000')
});