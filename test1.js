
// ** Important Note about data arrays **
//		automatically created on creation of j19DataDef instance (unless data array already exists)
//		placed in j19db
//		To clear a data array. use j19db[recName].length = 0, do not set to new empty array (breaks references)

var db = {};  	// container for data arrays
j19db = db;  	// used by j19 Functions

var dataDefs = {};

function main() {
	console.log("start");
	loadData(wsData);   // wsData defined in test1data.js
	joinData();
	//showData();
	//showChildren();
	//showRelated();
	//sortData();
	sumPay();
	console.log("done");
}

// loads data from web service into local db
function loadData(inData) {
	var settings, dataDef, inRecs, inRec, j19rec;
	for(recName in inData) {
		console.log("load " + recName);
		settings = dataDefSettings[recName];
		dataDefs[recName] = new j19DataDef(settings);
		inRecs = inData[recName];
		for( var i=0, cnt=inRecs.length; i<cnt; i++ ) {
			inRec = inRecs[i];
			if( recName == "paycheck" ) {
				inRec.paydate = new Date(inRec.paydate);
			}
			j19rec = new j19Rec(dataDefs[recName], inRec);
			j19rec.add();   // rec obj added to j19db[recName] array
		};
	};
	console.log("loadData complete");
}

function joinData() {
	var ok;
	db.emp.forEach(function(rec) {
		ok = rec.join("job");
		if(!ok)	alert("emp_job join did not work"); 
	})
	db.paycheck.forEach(function(rec) {		
		ok = rec.join("emp");	// this step will also add paycheck indx to parent emp's children.paycheck[]
		if(!ok)	alert("paycheck_emp join did not work"); 
	})
	db.payline.forEach(function(rec) {
		ok = rec.join("paycheck"); 	// this step will also add payline indx to parent paycheck's children.payline[]
		if(!ok)	alert("payline_paycheck join did not work"); 
		ok = rec.join("paycode");
		if(!ok)	alert("payline_paycode join did not work"); 
	})
	console.log("joinData complete");
} 

function showData() {
	console.group("show all data");
	for(tbl in db) {
		console.log( tbl );
		output = [];
		j19Loop( db[tbl], function(rec) {
			output.push( rec.get() );
		})
		console.table(output);
	}
	console.groupEnd();
}

function showChildren() {
	console.group("show children, paychecks by emp");
	var childndxs;
	db.emp.forEach( function(emprec) {
		console.log( emprec.get("name") );
		childndxs = emprec.getChildren("paycheck");
		j19Loop( db.paycheck, function(checkrec) {
			console.log( "paycheck date " + checkrec.get("paydate") );
		}, childndxs);
	})
	console.groupEnd();
} 

function showRelated() {
	console.group("show related");

	db.emp.forEach( function(emp) {
		console.log( emp.get("name") + " " + emp.getRelated("job", "jobName") );
	})
	db.payline.forEach( function(payline) {
		paycode = payline.getRelated("paycode");
		console.log( paycode.get("type"), paycode.get("name"), payline.get('amt') );
	})
	console.groupEnd();
}

function sortData() {
	console.group("sort data");

	var sortOrder = j19Sort( db.emp, ["job.jobName", "name"] );
	j19Loop( db.emp, function(emp) {
		console.log( emp.getRelated("job", "jobName"), emp.get("name") );
	}, sortOrder);

	sortOrder = j19Sort( db.paycheck, ["paydate:d"] );
	j19Loop( db.paycheck, function(paycheck) {
		console.log( paycheck.get("paydate"), paycheck.getRelated("emp", "name") );
	}, sortOrder);

	console.groupEnd();
}

function sumPay() {
	console.group("sumPay");

	dataDefs["totalpay"] = new j19DataDef( dataDefSettings["totalpay"] );   // defines output rec of sum process, j19db[totalpay] also created
	var keyFlds = ["paycode_id"];
	var sumFlds = ["amt"];
	var sumPay = new j19Sum(keyFlds, sumFlds, dataDefs["totalpay"]);

	var sortOrder = j19Sort( db.payline, ["paycode_id"] );
	sumPay.sum( db.payline, sortOrder );
	output = [];
	j19Loop( db.totalpay, function(rec) {
		output.push( rec.get() );
	})
	console.table(output);

	console.groupEnd();
}

	




	