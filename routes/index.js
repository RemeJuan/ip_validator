'use strict';

let express = require('express'),
		router 	= express.Router(),
		fs 			= require('fs'),
		multer  = require('multer'),
		upload 	= multer({ dest: 'public/uploads/' }),
		reader 	= require ("buffered-reader"),
		DataReader = reader.DataReader,

		validateIPaddress = (ipaddress) => {
			if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
				{
		    	return true;
		  	}
			return false;
		};

/* GET home page. */
router.route('/')
.get((req, res) => {
	let vm = {
		title: 'IP Validator',
		desc: `Use the text box to validate if the input is an IP address or not, enter 1 per line.`
	};

  res.render('index', vm);
})
.post(upload.single('fileUpload'), (req, res) => {
	console.log(req.file);

	new DataReader (req.file.path, { encoding: "utf8" })
	    .on ("error", function (error){
	        console.log ("error: " + error);
	    })
	    .on ("line", function (line){
	      console.log ("line: " + line, validateIPaddress(line));
	    })
	    .on ("end", function (){
	        console.log ("EOF");
	    })
	    .read ();

	// let rows,
	// 		validData = fs.createWriteStream(`./public/results/valid_ips_${new Date().getTime()}.txt`),
	// 		invalidData = fs.createWriteStream(`./public/results/invalid_ips_${new Date().getTime()}.txt`),
			let vm = {
				title: 'IP Validator',
				desc: `Use the text box to validate if the input is an IP address or not, enter 1 per line.`,
				response: 'List processed successfully'
			};

	// rows = req.body.validator.replace(/\r\n/g,"\n").split("\n");

	// validData.once('open', (fd) => {
	//   rows.forEach((data) => {
	//   	if( validateIPaddress(data) ) {
	//   		validData.write(`${data}\n`);
	//   	}
	//   });
	//   validData.end();
	// });

	// invalidData.once('open', (fd) => {
	//   rows.forEach((data) => {
	//   	if( !validateIPaddress(data) ) {
	//   		invalidData.write(`${data}\n`);
	//   	}
	//   });

	//   invalidData.end();
	// });

	res.render('index', vm);
});

module.exports = router;
