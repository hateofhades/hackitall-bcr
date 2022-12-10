const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://dbTest:parolamea123@cluster0.jnezpyt.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "bcr";
const nodemailer = require('nodemailer');
const http = require('https');
const axios = require('axios');
const ical = require('ical-generator');
const fs = require('fs');
const request = require('request');
const Str = require('@supercharge/strings')
const fetch = require('fetch');

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

app.listen(5001, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("branches");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.listen(5002, () => {
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

const responseToReadable = response => {
    const reader = response.body.getReader();
    const rs = new Readable();
    rs._read = async () => {
        const result = await reader.read();
        if(!result.done){
            rs.push(Buffer.from(result.value));
        }else{
            rs.push(null);
            return;
        }
    };
    return rs;
};

async function getMapsImage(request) {
	let url = "https://maps.googleapis.com/maps/api/staticmap?size=600x400&key=AIzaSyCftc-FGZMnkDhWCMZgNENW9bF9EF8RhRY" + "&center=" + request.body['latitude'] + "," + request.body['longitude'] + "&zoom=15" + "&markers=" + request.body['latitude'] + "," + request.body['longitude'];
	console.log(url);

	//const response = await axios.get(url)
		//.then((response) => {
			//return response;
		//}).catch((err) => {
			//console.error(err);
		//});
	let random = Str.random() 

	let rand = Str.random(5)
	let filepath = "/tmp/" + rand;
	const writer = fs.createWriteStream(filepath)
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	});

	console.log(url);
	console.log(filepath);
	response.data.pipe(writer)


	//fetch.fetchUrl(url).then(response => responseToReadable(response).pipe(fs.createWriteStream(filepath)));

	return filepath;
}

async function sendMail(request) {
	console.log(request.body['email']);

	let image = await getMapsImage(request);
	console.log(image);

	let id_entr = await get_id(request.body['lastname'], request.body['firstname'], request.body['location']);
	console.log(id_entr);

	let mapsUrl = "https://www.google.com/maps/search/?api=1&query=" +
		request.body['latitude'] + "%2C" + request.body['longitude'];
	console.log(mapsUrl);

	let delUrl = "http://localhost:5002/appointmentsDel/" + id_entr;

	let message = {
			html: 'Salut ' + request.body['firstname'] + ',\n\n' +
			'Programarea ta la BCR <b>' + request.body['location'] + '</b>' +
			' a fost confirmată.\n\n' +
			'Embedded image: <img src="cid:unique@nodemailer.com"/>',
			attachments: [{
			        filename: 'image.png',
			        path: image,
			        cid: 'unique@nodemailer.com' //same cid value as in the html img src
			    }]
		}

	mailOptions = {
		to: request.body['email'],
		subject: "Subiect programare", // Subject line
		//from: '"Programări BCR" <bcr-no-reply@mail.com>', // sender address
		//html: "<b>Hello world?</b>", // html body
		//text: "Hello world?", // plain text body
		//html: 'Embedded image: <img src="cid:unique@nodemailer.com"/>',
		html: 'Salut ' + request.body['firstname'] + ',<br><br>' +
		'Programarea ta la BCR <b>' + request.body['location'] + '</b>' +
		' a fost confirmată.<br><br>' +
		'<img src="cid:unique@nodemailer.com"/>' +
		'<a href=' + mapsUrl + '><b>Vezi imaginea pe hartă:</b></a><br><br>' +
		'Pentru a anula rezervarea, apasă <a href=' + delUrl + '>aici</a><br><br>',
		attachments: [{
			filename: 'image.png',
			path: image,
			cid: 'unique@nodemailer.com' //same cid value as in the html img src
		    }]
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

async function get_id(name, firstname, location) {
	let get_rc = await collectionAppo.find({}).toArray();
	//console.log(get_rc);

	let got_id = await collectionAppo.findOne({ "firstname": firstname,
			"lastname": name, "location": location});
	console.log(got_id['_id'].id.toString());
	let id = '';
	got_id['_id'].id.forEach(function(entr) {
		id = id + Number(entr).toString(16);
	});

	console.log(id);
	return id;
}

async function delete_by_id(id) {
	let got_id = await collectionAppo.findOne({"_id": new ObjectId(id)});
	console.log(got_id);
	collectionAppo.remove(got_id);
}

app.get("/appointmentsDel/:id", (request, response) => {
	delete_by_id(request.params.id);
	response.status(200).send();
});

app.post("/appointmentsCancel", (request, response) => {
	get_app_by_name(request);
	response.status(200).send();
});
