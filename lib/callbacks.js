module.exports.responseCallback = function (res) {
    
    return function(err, doc) {

				if (err) {
					
					res.status(500)
						.json({ error : "can't to get data",
								detail : err })
						.end();

				} else {

					var code = 200;
					if (!doc) {
						
						code = 404;
						doc = {};
						doc.error = "can't to get data";
						doc.detail = "Document not exist."
						
					}
					res.status(code)
						.json(doc)
						.end();

				}

			};
			
}