// sum payline.amt by emp.id,, paycode.type, paycode.name 

function test5a() {
	console.group("test5a - create temp table (outEmpPay)");
	var settings = dataDefSettings["outEmpPay"];  // in testdata_settings.js
	var dataDef = new j19DataDef(settings);
	var out = {};
	var j19rec;
	db.payline.forEach( function(payline) {
		out.emp_id = payline.getRelated("paycheck", "emp_id");
		out.paycode_type = payline.getRelated("paycode", "type");
		out.paycode_name = payline.getRelated("paycode", "name");		
		out.amt = payline.get("amt");	
		j19rec = new j19Rec(dataDef, out);
		j19rec.add();
	});
	console.groupEnd();
}

function test5b() {
	console.group("test5b - using outEmpPay, sum paycheck data by emp");

	defSettings = {   				// output of sum process
		name: "sumbyemp",			// j19db.sumbyemp - data rec array will be created when dataDef is created
		flds: ["emp_id", "paycode_type", "paycode_name", "amt", "count"],
		related: {
			emp: { join:"emp_id", to:"id" }
		},
		children: []
	}
	var dataDef = new j19DataDef(defSettings);	
	var keyflds = ["emp_id", "paycode_type", "paycode_name"];
	var sumflds = ["amt"];
	var sumPay = new j19Sum( keyflds, sumflds, dataDef );
	
	var sortOrder = j19Sort( db.outEmpPay, keyflds );
	sumPay.sum( db.outEmpPay, sortOrder );
	
	// display sum results
	var sumvals;
	var out = {};
	j19Loop( db.sumbyemp, function(sumrec) {
		sumrec.join("emp");
		sumvals = sumrec.get();
		out.name = sumrec.getRelated("emp", "name");
		out.emp_id = sumvals.emp_id;
		out.paycode_type = sumvals.paycode_type;
		out.paycode_name = sumvals.paycode_name;
		out.total = sumvals.amt;
		out.count = sumvals.count;
		for(fld in out) {
			if( out[fld] == null ) {
				out[fld] = '----';
			}
		}
		console.log(out.emp_id, out.name, out.paycode_type, out.paycode_name, out.total, " count: ", out.count);
	});
	console.groupEnd();
}