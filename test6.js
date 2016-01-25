// change values

function test6() {
	console.group("*** test6 ***");

	var filter = j19Qry( db.payline, function(payline) {
		if( payline.getRelated( "paycode", "type" ) == "earning" ) 
			return true;
		else
			return false;
	});
	var sortFilter = j19Sort( db.payline, ["paycode.name"], filter);

	j19Loop( db.payline, function(payline) {
		payline.set("amt", 1.25, payline.MULTIPLY);
		console.log( payline.getRelated("paycode", "name"), "new amt ", payline.get("amt") );
	}, sortFilter);

	console.groupEnd();
}