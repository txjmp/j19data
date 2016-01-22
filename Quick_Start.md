#Quick Start
```
var db = {};   // define object to hold data arrays, use whatever name you like
j19db = db;    // j19 funcs use this var

// define rec types
settings = {
  emp: {
		name: "emp",    // ** used as name of data rec array in j19db **
		flds: ["id", "name", "job_id"],
		related: {
			job: {join:"job_id", to:"id"}
		},
		children: ["paycheck"],
	},
	job: {
		name: "job",
		flds: ["id", "jobName", "class"],
		related: {},
		children: [],
	}
}
// create instance of j19DataDef for each record type
empDataDef = new j19DataDef( settings.emp );  // creates j19db[emp] array
jobDataDef = new j19DataDef( settings.job );  // creates j19db[job] array

// create data records & add to data array
empRec = new j19Rec( empDataDef, {id:1, name:"Bob", job_id:3} );
empRec.add();
```
##To Understand the whole process
1. Download Zip of this repo & extract
2. Look at test.html, it loads some test data and runs test functions
3. Look at testdata_settings.js and testdata.js (tests use these)
4. Look at test1.js, test2.js, etc. to see the code for each test
5. Open test.html in browser - output is sent to console in Developer Tools (f12)