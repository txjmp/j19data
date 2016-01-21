function test1() {
	console.log("*************** test1 starting *************");
	showData();
	showChildren();
	showRelated();
	sortData();
	sumPay();
	qryData();
	console.log("*************** test1 done ****************");
}

function showData() {
	console.group("show all data");
	for(tbl in db) {
		console.log( tbl );
		j19Loop( db[tbl], function(rec) {
			console.log( rec.get() );
		})
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
		console.log( emp.get("name") + ", " + emp.getRelated("job", "jobName") );
	})
	db.payline.forEach( function(payline) {
		paycode = payline.getRelated("paycode");
		console.log( paycode.get("type"), ", ", paycode.get("name"), payline.get('amt') );
	})
	console.groupEnd();
}

function sortData() {
	console.group("sort data");

	console.log("by job.jobName, name");
	var sortOrder = j19Sort( db.emp, ["job.jobName", "name"] );
	j19Loop( db.emp, function(emp) {
		console.log( emp.getRelated("job", "jobName"), emp.get("name") );
	}, sortOrder);

	console.log("by paydate descending");
	sortOrder = j19Sort( db.paycheck, ["paydate:d"] );
	j19Loop( db.paycheck, function(paycheck) {
		console.log( paycheck.get("paydate"), paycheck.getRelated("emp", "name") );
	}, sortOrder);

	console.groupEnd();
}

function sumPay() {
	console.group("sumPay");

	// datadef defines output rec of sum process, j19db[totalpay] also created
	dataDefs["totalpay"] = new j19DataDef( dataDefSettings["totalpay"] );   
	var keyFlds = ["paycode_id"];
	var sumFlds = ["amt"];
	var sumPay = new j19Sum(keyFlds, sumFlds, dataDefs["totalpay"]);

	var sortOrder = j19Sort( db.payline, ["paycode_id"] );  // data must be sorted by keys
	sumPay.sum( db.payline, sortOrder );

	j19Loop( db.totalpay, function(rec) {
		console.log( rec.get() );
	})

	console.groupEnd();
}

function qryData() {
	console.group("qryData");
	console.log("just wait staff");
	var selectJob = "wait staff";
	var selected = j19Qry( db.emp, function(emp) {
		if( emp.getRelated( "job", "jobName" ) == selectJob ) {
			return true; 
		} else {
			return false;
		}
	});
	var empvals;
	j19Loop( db.emp, function(emp) {
		empvals = emp.get();
		console.log( empvals.id, empvals.name, emp.getRelated("job", "jobName") );
	}, selected);

	console.groupEnd();
}

	




	