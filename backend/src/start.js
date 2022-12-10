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
const cors = require('cors');

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
app.use(cors(
	{
		origin: 'http://localhost:8082'
	}
));
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
		html: `
		<head>
		<style>
		body {

		   color: black;
		   }

		p {
			font-size: 16px;
		}

		   .logo { 
		   margin: 0 auto;
		   width: 100px; 
		   display: block;
		   border-radius: 8%;
		   }

		.imag { 
			margin: 0 auto;
			width: 400px; 
			display: block;
		border-radius: 2%;
			outline: solid 2px #333; /* This will add a solid, 2px-wide, #333-colored outline to the image */
		}
		</style>
		</head>

		<body>
		<p><img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F2performant.com%2Fblog%2Fwp-content%2Fuploads%2F2015%2F09%2Flogo-BCR-high-resolution-1980x1080.jpg&amp;f=1&amp;nofb=1&amp;ipt=0f6e768d9e50f49052056a6b52c4fa116333346bb228d54926c937cb346818ff&amp;ipo=images" class="logo"></p>
		<p>Bună, <strong>` + request.body['firstname'] + `</strong></p><br>
		<p>Programarea ta la ` + request.body['location'] + ` a fost confirmată</p>
		<p><img src="cid:unique@nodemailer.com" class="imag"></p>
		<p>Vezi locația pe hartă <a href="` + mapsUrl + `">aici</a>.</p><br>
		<p>Pentru a anula rezervarea, apasă <a href="` + delUrl + `">aici</a>.</p><br>
		<p>Cu drag,</p>
		<p>Echipa BCR</p>
		</body>
		`,

		//'Salut ' + request.body['firstname'] + ',<br><br>' +
		//'Programarea ta la BCR <b>' + request.body['location'] + '</b>' +
		//' a fost confirmată.<br><br>' +
		//'<img src="cid:unique@nodemailer.com"/>' +
		//'<a href=' + mapsUrl + '><b>Vezi imaginea pe hartă:</b></a><br><br>' +
		//'Pentru a anula rezervarea, apasă <a href=' + delUrl + '>aici</a><br><br>',
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
	console.log(got_id['_id'].id);
	let id = '';
	let nr = '';
	got_id['_id'].id.forEach(function(entr) {
		nr = Number(entr).toString(16);

		if(nr.length < 2)
			nr = '0' + nr;

		id = id + nr;
	});

	console.log(id);
	return id;
}

async function delete_by_id(id) {
	console.log(id);
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
