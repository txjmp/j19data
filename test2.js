
function test2() {
	console.group("test2");
	var settings = dataDefSettings["temp_emppay"];  // dataDefSettings in testdata_settings.js
	dataDefs[settings.name] = new j19DataDef(settings);
	var recvals = {};
	var paycodeRec, j19rec;
	db.payline.forEach( function(payline) {
		recvals.emp_id = payline.getRelated("paycheck", "emp_id");
		paycodeRec = payline.getRelated("paycode");
		recvals.paycode_type = paycodeRec.get("type");
		recvals.paycode_name = paycodeRec.get("name");
		recvals.payline_amt = payline.get("amt");
		j19rec = new j19Rec(dataDefs[settings.name], recvals);
		j19rec.add();
	});
	db.temp_emppay.forEach( function(rec) {
		console.log( rec.get() );
	});
	console.groupEnd();
}