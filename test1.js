var db = {};  	// container for data arrays
j19db = db;  	// used by j19 Functions

function main() {
	console.log("start");
	loadData(wsData);   // wsData defined in test1data.js
}

function loadData(inData) {
	var settings, dataDef, inRecs, inRec, j19rec;
	for(recName in inData) {
		console.log("load " + recName);
		settings = dataDefSettings[recName];
		dataDef = new j19DataDef(settings);
		inRecs = inData[recName];
		for( var i=0, cnt=inRecs.length; i<cnt; i++ ) {
			inRec = inRecs[i];
			if( recName == "paycheck" ) {
				inRec.paydate = new Date(inRec.paydate);
			}
			j19rec = new j19Rec(dataDef, inRec);
			j19rec.add();   // rec obj added to j19db[recName] array
		};
	};
} 

	
	