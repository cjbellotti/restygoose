var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	callbacks = require('./callbacks'),
	queryString = require('querystring'),
	Url = require('url'),
	Schema = mongoose.Schema;

function extractModelName (url, prefixURL, sufixURL) {

	return url.substring(url.indexOf(prefixURL) + prefixURL.length + 1, 
												url.indexOf(sufixURL));

}

var Restygoose = function(config) {

	if (config === null)
		throw new Error('You must to specify configuration.');

	if (config.mongooseDef === null)
		throw new Error('You must to specify mongoose instance in configuration');

	if (config.prefixURL === null)
		config.prefixURL = "";

	if (config.sufixURL === null)
		config.sufixURL = "";

	if (config.models === null)
		config.models = {};

	var app = express();
	app.use(bodyParser.urlencoded({extended : false}));
	app.use(bodyParser.json());

	var models = config.mongooseDef.modelNames();

	for (var i  in models) {

		var modelName = models[i];

		var keys = "";

		if (config.models[modelName] != null) {

			for (var i in config.models[modelName].keys) {
				keys += '/:' + config.models[modelName].keys[i];
			}

		}

		var baseURL = config.prefixURL + '/' + modelName + config.sufixURL;

		var url = baseURL;
		console.log('Generating GET for %s (%s)...', modelName, url);
		app.get(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			var search = {};

			var params = queryString.parse(Url.parse(req.url).query);

			if (params.populate) {
				
				mongooseModel.find(search)
					.populate(params.populate.replace(',', ' '))
					.exec(callbacks.responseCallback(res));
				
			} else {
				
				mongooseModel.find(search, callbacks.responseCallback(res));
				
			}

		});

		url = baseURL + keys;
		console.log('Generating GET for %s (%s)...', modelName, url);
		app.get(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			var params = queryString.parse(Url.parse(req.url).query);

			if (params.populate) {
				
				mongooseModel.findOne(req.params)
					.populate(params.populate.replace(',', ' '))
					.exec(callbacks.responseCallback(res));
				
			} else {
				
				mongooseModel.findOne(req.params, callbacks.responseCallback(res));
			
			}
			
		});

		url = baseURL;
		console.log('Generating POST for %s (%s)...', modelName, url);
		app.post(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			mongooseModel.create(req.body, callbacks.responseCallback(res));
			
		});

		url = baseURL + keys;
		console.log('Generating PUT for %s (%s)...', modelName, url);
		app.put(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];
			
			mongooseModel.findOneAndUpdate(req.params, req.body, {}, callbacks.responseCallback(res));


		});

		url = baseURL + keys;
		console.log('Generating DELETE for %s (%s)...', modelName, url);
		app.delete(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			mongooseModel.findOneAndRemove(req.params, {}, callbacks.responseCallback(res));

		});

	}

	return app;

};

module.exports = Restygoose;