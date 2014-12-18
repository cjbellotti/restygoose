var request = require('supertest'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	app = require('express')(),
	Restify = require('../index'),
	expect = require('chai').expect;

mongoose.connect('mongodb://localhost/testmocha');

var customers = new Schema({
	id : { type : Number },
	name : { type: String },
	lastname : { type : String },
});

var users = new Schema({
	username : { type: String },
	password : { type : String },
});

mongoose.model('customers', customers);
mongoose.model('users', users);

// Config restygoose
var config = {

	mongooseDef : mongoose, 
	prefixURL : '/api',
	sufixURL : '/rest',
	models : {
		customers : {
			keys : ['id', 'name?']
		},
		users : {
			keys : ['username', 'password']
		}
	}

};

var api = new Restify(config);
app.use(api);

request = request(app);

describe('test API REST for custumers generated by restygoose.', function () {

	describe('POST', function () {

		it('It must create a custumer', function (done) {

			var data = { 
				id : 1,
				name : "Customer 1",
				lastname : "Customer 1's lastname"
			};

			request
				.post ('/api/customers/rest')
				.set('Accept', 'application/json')
				.send(data)
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.end (function (err, res) {

					if (err)
						throw new Error('Error creating custumer: ' + err);

					var resData = res.body;
					console.log(res.body);
					expect(resData).to.have.property('id', data.id);
					expect(resData).to.have.property('name', data.name);
					expect(resData).to.have.property('lastname', data.lastname);

					done(err);
				});

		});

	});

});
