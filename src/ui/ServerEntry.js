import React from "react";
import { renderToString } from "react-dom/server";

import { commonAPI as app, startServer } from "../util/ExpressJSUtils.js";
import { configManagerObj } from "../util/ConfigManager.js";
var QueryManager = require("../svc/QueryManager");

import App from "./components/app/app";

const PORT = configManagerObj.env_config_server_port;

const healthInfoURL = "/browseapp/v1/api/health";
app.get(healthInfoURL, function(req, res) {
	var responseData = {
		status: "UP",
		healthInfo: { status: "UP", appName: "browse-app API Service" }
	};
	res.send(responseData);
});

const pageURL = "/page";
app.get(pageURL, function(req, res) {
	console.log(QueryManager);
	QueryManager.getComponent().then(function(component) {
		
		let htmlString = renderToString(<App />);
		res.send(`
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<title>Browse App</title>
				</head>
				<body>
					${htmlString}
					${component.data}
				</body>
			</html>
		`);
	});
});

startServer(app, PORT, function() {});