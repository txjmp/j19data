// display paycheck data by emp

function test3() {
	var empPaychecks, paylines;
	var tot = 0;
	j19Loop( db.emp, function(emp) {
		console.group( emp.get("name") );
		empPaychecks = emp.getChildren("paycheck");

		// --- paychecks ------
		j19Loop( db.paycheck, function(paycheck) {
			console.log( fmtDate( paycheck.get("paydate") ) );
			paylines = paycheck.getChildren("payline");

			// --- paylines --------
			j19Loop( db.payline, function(payline) {
				tot += payline.get("amt");
				paycodeName = payline.getRelated( "paycode", "name" );
				console.log( paycodeName, payline.get("amt") );
			}, paylines);
			console.log("-------------");
		}, empPaychecks);  // paycheck loop end
		
		console.groupEnd();

	});  // emp loop end
}