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
		console.log( payline.get("id"), payline.getRelated("paycode", "name"), "new amt ", payline.get("amt") );
	}, sortFilter);

	console.groupEnd();
}

// display changed values & reset change flags
function test6b() {
	console.group("get changed payline amts, using getChanged() method");
	db.payline.forEach( function(rec) {
		if( rec.recChanged ) {
			changes = rec.getChanged();
			console.log( rec.get("id"), changes );
		}
		rec.clearChangedFlags();
	});
	console.log("make sure changes have cleared, should display empty object for each payline");
	db.payline.forEach( function(rec) {
		if( rec.recChanged )
			console.log("error - recChanged flag not cleared");
		changes = rec.getChanged();
		console.log( rec.get("id"), changes );
	});
	console.groupEnd();
}


