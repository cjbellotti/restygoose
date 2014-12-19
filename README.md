# restygoose

Automatic publish the API REST for models in a mongoose instance.

## Example

Here I'm publish the API REST for the models Customers and Users

  mongoose.connect('mongodb://localhost/testmocha');
  
  // Defining models
  var customers = new Schema({
  	id : { type : Number },
  	name : { type: String },
  	lastname : { type : String },
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
  app.use(api);
  app.listen(3000, function() {
    console.log('Server listening on port 3000...");
  });
