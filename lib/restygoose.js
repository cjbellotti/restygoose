var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	Schema = mongoose.Schema;

var definitions = {};

function extractModelName (url, prefixURL, sufixURL) {

	return url.substring(url.indexOf(prefixURL) + prefixURL.length + 1, 
												url.indexOf(sufixURL));

}

var Restygoose = function(config) {

	if (config == null)
		throw new Error('You must to specify configuration.');

	if (config.mongooseDef == null)
		throw new Error('You must to specify mongoose instance in configuration');

	if (config.prefixURL == null)
		config.prefixURL = "";

	if (config.sufixURL == null)
		config.sufixURL = "";

	if (config.models == null)
		config.models = {};

	var app = express();
	app.use(bodyParser.urlencoded({extended : false}));
	app.use(bodyParser.json());

	var models = config.mongooseDef.modelNames();

	for (var i  in models) {

		var model = {};

		model.name = models[i];

		model.fields = config.mongooseDef.models[model.name].schema.paths;

		model.def = config.mongooseDef.models[model.name];

		definitions[model.name] = model;

		var keys = "";

		if (config.models[model.name] != null) {

			for (var i in config.models[model.name].keys) {
				keys += '/:' + config.models[model.name].keys[i];
			}

		}

		var mongooseModel = config.mongooseDef.models[model.name];
		
		var baseURL = config.prefixURL + '/' + model.name + config.sufixURL;

		var url = baseURL
		console.log('Generating GET for %s (%s)...', model.name, url);
		app.get(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			var search = {};

			mongooseModel.find(search, function (err, data) {

				if (err) {

					res.json({ error : "can't to get data",
								description : err })
						.end();

				} else {

					res.json(data)
						.end();

				}

			});

		});

		url = baseURL + keys;
		console.log('Generating GET for %s (%s)...', model.name, url);
		app.get(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			var search = {};

			for (var key in req.params) {
				if (req.params[key])
					search[key] = req.params[key];
			}


			mongooseModel.findOne(search, function (err, data) {

				if (err) {

					res.json({ error : "can't to get data",
								description : err })
						.end();

				} else {

					res.json(data)
						.end();

				}

			});

		});

		url = baseURL;
		console.log('Generating POST for %s (%s)...', model.name, url);
		app.post(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			var newData = {};

			for (var key in req.body) {
				newData[key] = req.body[key];
			}

			var schema = new mongooseModel(newData);

			schema.save(function(err, doc) {

				if (err) {

					res.json({ error : "can't to get data",
								description : err })
						.end();

				} else {

					res.json(doc)
						.end();

				}

			});

		});

		url = baseURL + keys;
		console.log('Generating PUT for %s (%s)...', model.name, url);
		app.put(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			var toUpdate = {};
			var model = definitions[modelName];

	 		for (var key in req.body) {
	 			if (model.fields[key] != undefined)
	 				toUpdate[key] = req.body[key];
	 		}

			mongooseModel.findOneAndUpdate(req.params, toUpdate, { upsert : true}, function (err, data) {

				if (err) {

					res.json({ error : "can't to get data",
								description : err })
						.end();

				} else {

					res.json(data)
						.end();

				}

			});


		});

		url = baseURL + keys;
		console.log('Generating DELETE for %s (%s)...', model.name, url);
		app.delete(url, function (req, res) {

			// Extract model name from the url
			var modelName = extractModelName(req.url, config.prefixURL, config.sufixURL);
			var mongooseModel = config.mongooseDef.models[modelName];

			mongooseModel.findOneAndRemove(req.params, {}, function (err, data) {

				if (err) {

					res.json({ error : "can't to remove data",
								description : err })
						.end();

				} else {

					res.json(data)
						.end();

				}

			});

		});

	}

	return app;

}

module.exports = Restygoose;