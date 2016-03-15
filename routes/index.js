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
		desc: `Upload a text file with 1 item per line to filter out all valid IP addresses`
	};

	// Render view
  res.render('index', vm);
})
.post(upload.single('fileUpload'), (req, res) => {
	let	date = new Date().getTime(),
			validData = `./public/results/valid_ips_${date}.txt`,
			invalidData = `./public/results/invalid_ips_${date}.txt`,
			valArr = [], invalArr = [],
			vm = {
				title: 'IP Validator',
				desc: 'List processed successfully, you can download the processed data using the following links',
				links: {
					valid: `/results/valid_ips_${date}.txt`,
					invalid: `/results/invalid_ips_${date}.txt`
				}
			};

	new DataReader(req.file.path, { encoding: "utf8" })
	    .on ("error", error => {
	        console.log ("error: " + error);
	    })
	    .on ("line", line => {
	    	//Loop through each line and check if valid IP and push to relevant array
	      if(validateIPaddress(line)) {
	      	valArr.push(line);
	      }
	      else {
	      	invalArr.push(line);
	      }
	    })
	    .on ("end", () => {
	    	// Sort the array
	    	invalArr = invalArr.sort((a, b) => b-a);
	    	valArr = valArr.sort((a, b) => b-a);

	    	//Write data to files
	    	writeFile(validData, invalidData, valArr, invalArr);

	    	//Remove uploaded file
	      fs.unlink(req.file.path);
	    })
	    .read();

	// Render updated view
	res.render('index', vm);
});

module.exports = router;

function writeFile(validData, invalidData, valArr, invalArr) {
	//Open up valid file and loop through array to write each value on a new line
	fs.open(validData, 'a', (err, fd) => {
		valArr.forEach(line => {
			fs.write(fd, `${line}\r\n`);
		});
		// Close the file once done
		fs.close(fd);
	});

	//Open up valid file and loop through array to write each value on a new line
	fs.open(invalidData, 'a', (err, fd) => {
		invalArr.forEach(line => {
			fs.write(fd, `${line}\r\n`);
		});
		// Close the file once done
		fs.close(fd);
	});
}