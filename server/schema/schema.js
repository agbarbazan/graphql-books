const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

//grab properties from graphql package
const {
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull //set field required, will not accept null
} = graphql;

//will be describing two object types: books and authors and the relationship between them

//define object type - define book type
const BookType = new GraphQLObjectType({
  //define name of object type
  name:'Book',
  //describe fields for the book type, wrap in ES6 function
  fields:() =>({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args){
        //parent is the book object that was returned, matching the argument provided 
        //looking through author array to find the object that has authorId matching the parent (book) id argument provided
        //return _.find(authors, {id: parent.authorId});
       return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType), //a graphQL list of book types
      resolve(parent, args){
        //return _.filter(books, {authorId: parent.id}) //look for books where authorid = to id we provided
        return Book.find({authorId: parent.id});
      }
    }
  })
});



//define root queries: how a user can initially jump into a graph and grab data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //name of query goes here: "book"
    book: {
      type: BookType,
      //when someone queries a book type, want a user to pass an argument along to see which book the user wants: e.g., book(id:'123')
      args: {
        id: {type: GraphQLID}
      },
      resolve(parent, args){
        //code to get data from db / other source 
        //use args.id to query our db

        //use lodash to look through books array and find book with id that matches args
        //return _.find(books, {id: args.id});
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: {type: GraphQLID}
      },
      resolve(parent, args){
        //return _.find(authors, {id: args.id});
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return Book.find({}) //return the entire collection
      }
    },
    authors:{
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //add, delete authors
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
    resolve(parent, args){
      let author = new Author({
        name: args.name,
        age: args.age
      }); //this is our Author model  
      return author.save() // save our author instance into our database 
      //make sure to return something from resolve function
    }
   },
   addBook: {
    type: BookType,
    args: {
      name: {type: new GraphQLNonNull(GraphQLString)},
      genre: {type: new GraphQLNonNull(GraphQLString)},
      authorId: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve(parent, args){
      const {name, genre, authorId} = args;
      let book = new Book({
        name,
        genre,
        authorId, 
      }); //this is our Book model  
      return book.save() // save our book instance into our database 
     }
 }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

