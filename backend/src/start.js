const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://dbTest:parolamea123@cluster0.jnezpyt.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "bcr";
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'improvebyteshack2022@gmail.com',
        pass: 'lywljzhmcwsfavcm'
    }
});

// lywljzhmcwsfavcm
//const uri = "mongodb+srv://dbTest:parolamea123@cluster0.jnezpyt.mongodb.net/?retryWrites=true&w=majority";

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection, collectionAppo;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("branches");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.listen(5001, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collectionAppo = database.collection("appointments");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/branchesAdd", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/branches", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.post("/appointmentsAdd", (request, response) => {
    //collectionAppo.insert(request.body, (error, result) => {
        //if(error) {
            //return response.status(500).send(error);
        //}
        //response.send(result.result);
    //});

	console.log(request.body['email']);
	  let info = transporter.sendMail({
	    from: '"Programări BCR" <bcr-no-reply@mail.com>', // sender address
	    to: request.body['email'], // list of receivers
	    subject: "Subiect programare", // Subject line
	    text: "Hello world?", // plain text body
	    html: "<b>Hello world?</b>", // html body
	  });
});

app.get("/appointments", (request, response) => {
    collectionAppo.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//const BodyParser = require("body-parser");
//const Express = require("express");

//const uri = "mongodb+srv://dbTest:parolamea123@cluster0.jnezpyt.mongodb.net/?retryWrites=true&w=majority";

//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//client.connect(err => {
  //const collection = client.db("test").collection("devices");
  //// perform actions on the collection object
  //client.close();
//});

//const routes = require('./WebApp/Controllers');

//const ServerError = require('./WebApp/Models/ServerError.js');

//const app = express();

//app.use(cors());
//app.use(express.json());

//app.use('/api', routes);

//app.use((err, req, res, next) => {
    //if (err) {
        //console.error(err);
        //let status = 500;
        //let message = 'Something Bad Happened';
        //if (err instanceof ServerError) {
            //message = err.Message;
            //status = err.StatusCode;
        //}
        //return next(createError(status, message));
    //}
//});

//const port = process.env.PORT || 4200;

//app.listen(port, () => {
    //console.log(`App is listening on ${port}`);
//});
