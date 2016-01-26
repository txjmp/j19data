function test1() {
	console.log("*************** test1 starting *************");
	showData();
	showChildren();
	showRelated();
	sortData();
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
	var childndxs, paydate;
	db.emp.forEach( function(emp) {
		console.log( emp.get("name") );
		childndxs = emp.getChildren("paycheck");
		console.log("childndxs=" + childndxs);
		j19Loop( db.paycheck, function(checkrec) {
			paydate = checkrec.get("paydate");
			console.log( "paycheck empid-paydate: ", checkrec.get("emp_id"), "-", fmtDate(paydate) );
		}, childndxs);
	})
	console.groupEnd();
} 

function showRelated() {
	console.group("show related");
	console.log("--- emp + job ---")
	db.emp.forEach( function(emp) {
		console.log( emp.get("name") + ", " + emp.getRelated("job", "jobName") );
	})
	console.log("--- payline + paycode ---")
	var paycode;
	db.payline.forEach( function(payline) {
		paycode = payline.getRelated("paycode");
		console.log( paycode.get("type"), ", ", paycode.get("name"), ", amt:", payline.get('amt') );
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
		console.log( fmtDate(paycheck.get("paydate")), paycheck.getRelated("emp", "name") );
	}, sortOrder);

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

	




	