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

function getIcalObjectInstance(starttime, endtime, location, url)
{
	const cal = ical({ domain: "bcr.com",
		name: 'Programare BCR' });
	//cal.domain("mytestwebsite.com");
	cal.createEvent({
		start: new Date(starttime),         // eg : moment()
		end: new Date(endtime),             // eg : moment(1,'days')
		summary: "Programare BCR",         // 'Summary of your event'
		description: "", // 'More description'
		location: location,       // 'Delhi'
		//url: url,                 // 'event url'
		organizer: {              // 'organizer details'
			name: "BCR appointments",
			email: "improvebyteshack2022@gmail.com"
		},
	});
	return cal;
}

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

async function sendMail(request) {
	console.log(request.body['email']);

	mailOptions = {
		to: request.body['email'],
		subject: "Subiect programare", // Subject line
		//from: '"Programări BCR" <bcr-no-reply@mail.com>', // sender address
		//html: "<b>Hello world?</b>", // html body
		text: "Hello world?", // plain text body
	}

	//console.log(request['start_time'])
	let calendarObj = getIcalObjectInstance(request.body['starttime'], request.body['endtime'],
		request.body['location'], null);

	let alternatives = {
		"Content-Type": "text/calendar",
		"method": "REQUEST",
		"content": new Buffer(calendarObj.toString()),
		"component": "VEVENT",
		"Content-Class": "urn:content-classes:calendarmessage"
	}

	mailOptions['alternatives'] = alternatives;
	mailOptions['alternatives']['contentType'] = 'text/calendar'
	mailOptions['alternatives']['content'] 
	    = new Buffer(calendarObj.toString())

	transporter.sendMail(mailOptions, function(err, info){
	       console.log(err,info);
	});
}

app.post("/appointmentsAdd", (request, response) => {
    let insert_rc = collectionAppo.insert(request.body, (error, result) => {
	if(error) {
	    return response.status(500).send(error);
	}
	response.send(result.result);
    });

	console.log(insert_rc);

	sendMail(request);
});

app.get("/appointments", (request, response) => {
    collectionAppo.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

async function get_app_by_name(request) {
	let get_rc = await collectionAppo.find({}).toArray();
	console.log(get_rc);

	get_rc.forEach(function(entry) {
		console.log(entry);

		if (entry['firstname'] == request.body['firstname'] &&
		entry['lastname'] == request.body['lastname'] &&
		entry['email'] == request.body['email'] && 
		entry['starttime'] == request.body['starttime'] &&
		entry['endtime'] == request.body['endtime'] &&
		entry['location'] == request.body['location']) {

			let id = entry['_id'];
			console.log(id);

			collectionAppo.remove(entry);
		}
	});
}

app.post("/appointmentsCancel", (request, response) => {
	get_app_by_name(request);
	response.status(200).send();
});
