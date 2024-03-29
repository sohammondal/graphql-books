const express = require("express");
const graphqlHTTP = require("express-graphql");
const env = process.env.NODE_ENV;
const PORT = process.env.PORT || 4000;
const schema =
  env === "dev" ? require("./schema/dummySchema") : require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Setting Mongoose Debug based on Environment - PROD / DEV
mongoose.set("debug", env === "dev");

// allow cross origin requests
app.use(cors());

// Connect to Mongo
try {
  mongoose
    .connect(
      `mongodb://${process.env.DB_USER}:${
      process.env.DB_PASS
      }@ds243897.mlab.com:43897/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    ) // Adding new mongo url parser
    .then(() =>
      console.log("*************\tMONGODB CONNECTED\t\t*************")
    );
} catch (err) {
  console.error(err.message);
}

app.get('/', (req, res) => {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl + 'graphql';
  res.send(`The client side of the application is not ready yet. Please visit <a href="${url}">GraphiQL</a>`)
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(PORT, () =>
  console.log(`*************\tSERVER LISTENING ON PORT ${PORT}\t*************`)
);
