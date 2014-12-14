var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	Schema = mongoose.Schema;

var definitions = {};

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

		definitions[model.name] = model;

		var keys = "";

		if (config.models[model.name] != null) {

			for (var i in config.models[model.name].keys) {
				keys += '/:' + config.models[model.name].keys[i];
			}

		}

		var mongooseModel = config.mongooseDef.models[model.name];
		
		var baseURL = config.prefixURL + '/' + model.name + config.sufixURL;

		var url = baseURL + keys;
		console.log('Generating GET for %s (%s)...', model.name, url);
		app.get(url, function (req, res) {

			var search = {};

			for (var key in req.params) {
				search[key] = req.params[key];
			}


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

		url = baseURL;
		console.log('Generating POST for %s (%s)...', model.name, url);
		app.post(url, function (req, res) {

			var newData = {};

			for (var key in req.body) {
				newData[key] = req.body[key];
			}

			var schema = new mongooseModel(newData);

			schema.save(function(err) {

				if (err) {

					res.json({ error : "can't to get data",
								description : err })
						.end();

				} else {

					res.json(newData)
						.end();

				}

			});

		});

		url = baseURL + keys;
		console.log('Generating PUT for %s (%s)...', model.name, url);
		app.put(url, function (req, res) {

			res.end('PUT of ' + model.name);

		});

		url = baseURL + keys;
		console.log('Generating DELETE for %s (%s)...', model.name, url);
		app.delete(url, function (req, res) {

			res.end('DELETE of ' + model.name);

		});

	}

	return app;

}

module.exports = Restygoose;