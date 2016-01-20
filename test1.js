var j19db = {};
var j19DataDefs = {};

function main() {
	console.log("loading j19DataDefs");
	var settings;
	for(key in dataDefSettings) {
		settings = dataDefSettings[key];
		console.log(settings.name);
		j19DataDefs[key] = new j19DataDef(settings);
	}
	//for( recName in inData ) { 
	//	loadData(recName, inData[name]);
	//}
}

function loadData(recName, dataRecs) {
	dataRecs.forEach(function(vals) {
		def = j19DataDefs[recName];
		rec = new j19Rec(def, vals);
		rec.add();
	})
} 

	
	