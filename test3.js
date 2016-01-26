// using getChildren() display payline by paycheck by emp

function test3() {
	console.log("*** test3 ***");
	var empPaychecks;
	j19Loop( db.emp, function(emp) {
		console.group( emp.get("name") );	
		empPaychecks = emp.getChildren("paycheck");
		j19Loop( db.paycheck, test3Paycheck, empPaychecks ); 
		console.groupEnd();
	}); 
}
function test3Paycheck(paycheck) {
	console.log( "---", fmtDate( paycheck.get("paydate") ) );
	var paylines = paycheck.getChildren("payline");
	j19Loop( db.payline, test3Payline, paylines );
}
function test3Payline(payline) {
	var paycodeName = payline.getRelated( "paycode", "name" );
	console.log( paycodeName, payline.get("amt") );
}