// create output record, with values from multiple record types
// flds: ["emp_id", "paycheck_id", "paydate", "paycode_type", "paycode_name", "amt"],

function test2() {
	console.group("test2");
	var settings = dataDefSettings["outEmpPay"];  // in testdata_settings.js
	dataDefs[settings.name] = new j19DataDef(settings);
	var out = {};
	var paycodeVals, j19rec;
	db.payline.forEach( function(payline) {
		out.emp_id = payline.getRelated("paycheck", "emp_id");
		out.paycheck_id = payline.getRelated("paycheck", "id");
		out.paydate = payline.getRelated("paycheck", "paydate");

		paycodeVals = payline.getRelated("paycode").get();
		out.paycode_type = paycodeVals.type;
		out.paycode_name = paycodeVals.name;
		
		out.amt = payline.get("amt");
		
		j19rec = new j19Rec(dataDefs[settings.name], out);
		j19rec.add();
	});
	db.outEmpPay.forEach( function(rec) {
		console.log( rec.get() );
	});
	console.groupEnd();
}