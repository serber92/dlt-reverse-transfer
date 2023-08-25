const express = require("express");
const app = express();
const port = 3000;
const host = "0.0.0.0";
const connect = require("@databases/pg");
const { sql } = require("@databases/pg");

// needed to fetch db creds
const fs = require("fs");
var parser = require("xml2json");

function fetchDBCreds() {
	let configFileData = null;
	let filePath = "/usr/local/tomcat/conf/Catalina/localhost/server.conf";
	try {
		configFileData = fs.readFileSync(filePath, "utf8");
	} catch (err) {
		console.error(err);
	}

	var json = JSON.parse(parser.toJson(configFileData));
	var params = json["Context"]["Parameter"];

	let passwordParam = params.filter(function (el) {
		return el.name == "password";
	})[0]["value"];

	let userParam = params.filter(function (el) {
		return el.name == "user";
	})[0]["value"];

	let dbHost = process.env.DATABASE_ENDPOINT.slice(0, -5);

	const connectionParams = {
		database: "mydb",
		user: userParam,
		password: passwordParam,
		port: 5432,
		host: dbHost,
		ssl: false,
	};
	return connectionParams;
}

app.get("/", async (req, res) => {
	let queryText = sql`SELECT * FROM information_schema.columns;`;
	try {
		const connectionParams = fetchDBCreds();
		const db = connect(connectionParams);
		let dbResponse = await db.query(queryText);

		res.send(dbResponse);
	} catch (error) {
		console.error(error);
		res.send(error);
	}
});

app.get("/example", (req, res) => {
	res.send("second hardcoded /example endpoint");
});

const server = app.listen(port, host);

server.on("listening", function () {
	console.log(
		"Express server started on port %s at %s",
		server.address().port,
		server.address().address
	);
});
