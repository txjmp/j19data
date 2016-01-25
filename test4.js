// sum payline.amt by paycode_id, display paycode.type, paycode.name, total.amt

totalpaySettings = {   				// output of sum process
	name: "totalpay",				// j19db.totalpay - data rec array will be created when dataDef is created
	flds: ["paycode_id", "amt", "count"],
	related: {
		paycode: { join:"paycode_id", to:"id" }
	},
	children: []
}

function test4() {
	console.log("*** test4 ***");
	var dataDef = new j19DataDef(totalpaySettings);
	
	var keyflds = ["paycode_id"];
	var sumflds = ["amt"];

	var sumPay = new j19Sum( keyflds, sumflds, dataDef );
	
	var sortOrder = j19Sort( db.payline, keyflds );

	sumPay.sum( db.payline, sortOrder );

	var totline;
	var out = {};
	j19Loop( db.totalpay, function(totalpay) {
		totalpay.join("paycode");	
		out.paycodeType = totalpay.getRelated("paycode", "type");
		out.paycodeName = totalpay.getRelated("paycode", "name");
		out.total = totalpay.get("amt");
		console.log( out );
	});
}