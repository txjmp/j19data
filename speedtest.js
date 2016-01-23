function speedTest() {
	var start = new Date().getTime();
	var tot = 0;
	for( var i=0; i<10000; i++ ) {
		j19Loop( db.payline, function(rec) {
			tot += rec.get("amt");
		});
	}
	var stop = new Date().getTime();
	console.log(tot);
	var elapsed = (stop - start) / 1000;
	console.log( "seconds: " + elapsed );
}