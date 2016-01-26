// create output record, with values from multiple record types
// flds: ["emp_id", "paycheck_id", "paydate", "paycode_type", "paycode_name", "amt"],

function test2() {
	console.group("*** test2 ***");
	var settings = dataDefSettings["outEmpPay"];  // in testdata_settings.js
	var dataDef = new j19DataDef(settings);
	var outVals = {};
	var paycodeVals, j19rec;
	db.payline.forEach( function(payline) {
		outVals.emp_id = payline.getRelated("paycheck", "emp_id");
		outVals.paycheck_id = payline.getRelated("paycheck", "id");
		outVals.paydate = payline.getRelated("paycheck", "paydate");

		paycodeVals = payline.getRelated("paycode").get();
		outVals.paycode_type = paycodeVals.type;
		outVals.paycode_name = paycodeVals.name;
		
		outVals.amt = payline.get("amt");
		
		j19rec = new j19Rec(dataDef, outVals);
		j19rec.add();
	});
	db.outEmpPay.forEach( function(rec) {
		rec.join("emp");
		console.log( rec.get() );
	});
	console.groupEnd();
}