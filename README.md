# restygoose

Automatic publish the API REST for models in a mongoose instance.

This generate an instance of express with the API REST to manipulate mongoose models.

## Example

```javascript
var Restify = require('restify');

var customers = new Schema({
	id : { type : Number },
	name : { type: String },
	lastname : { type : String },
	user : { type : Schema.Types.ObjectId, ref: 'users' }
});

var users = new Schema({
	username : { type: String },
	password : { type : String },
});

var customersModel = mongoose.model('customers', customers);
var usersModel = mongoose.model('users', users);

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
```
with this you can get the following API REST

Get a list
```
GET /api/customers/rest
```
Get a populated list
```
GET /api/customers/rest?populate=field1,field2,...,fieldN
```
Get a individual document
```
GET /api/customers/rest/$id/$name
```
Get a populated individual document
```
GET /api/customers/rest/$id/$name?populate=field1,field2,...,fieldN
```
Create a new documente
```
POST /api/customers/rest
```
Update a document
```
PUT /api/customers/rest/$id/$name
```
Delete a document
```
DELETE /api/customers/rest/$id/$name
```
## Configuration explanation

The following is the options availables to configuring the API REST

* <b>mongooseDef: </b> is de mongoose instance that contains the models.
* <b>prefixURL: </b> is the prefix for the API REST's urls (optional)
* <b>sufixURL: </b> is the sufix for the API REST's urls (optional)
* <b>models: </b> is an object to specify individual model's parameters. Only Key specification is available for the moment.

## Why
Because I needed it for a proyect and I want to make this to share it with the community.
