var j19db;	// must be set during startup by app  ex. j19db = db; where db = {};

Array.prototype.j19GetNdx = function(searchVal) {
	var ndx = -1;
	for(var i=0, cnt=this.length; i<cnt; i++) {
		if(this[i] === searchVal) {
			ndx = i;
			break;
		}	
	}
	return ndx;
}

function j19Error( msg ) {
	var errMsg = '** Hey Programmer: j19 Error ** \n' + msg;
	alert( errMsg );
}

function j19Sequence( length ) {
	var seq = [];
	for(var i=0; i<length; i++) {
		seq[i] = i;
	}
	return seq;
}

function j19DataDef( settings ) {
	this.name = settings.name;
	if( j19db[this.name] == undefined ) {
		j19db[this.name] = [];
	}
	this.data = j19db[this.name];
	this.flds = settings.flds.slice();
	this.flds.push('myndx');  // used for index value of this rec in data array

	this.related = settings.related;
	for( tblName in settings.related ) {
		this.flds.push( "join_" + tblName );
	}
	this.fldNdx = {};
	for(var i=0; i<this.flds.length; i++) {
		this.fldNdx[this.flds[i]] = i;
	};
	this.children = settings.children;		
}

j19Rec.prototype.ADD = 'add';
j19Rec.prototype.SUBTRACT = 'subtract';
j19Rec.prototype.MULTIPLY = 'multiply';

function j19Rec( datadef, initVals ) {
	if( !(datadef instanceof j19DataDef) ) {
		j19Error("j19Rec constructor parm not instance of j19DataDef");
		return; 
	}	
	this.def = datadef;
	this.vals = [];
	this.recChanged = false;
	this.fldChanged = [];
	if(initVals) {
		this.load(initVals);
	}
	this.children = {};
	var childname;
	for(var i=0; i<datadef.children.length; i++) {
		childname = datadef.children[i];
		this.children[childname] = [];
	};
}

j19Rec.prototype.add = function() {
	this.set( 'myndx', this.def.data.length );
	this.def.data.push( this );
}

// get value from record, if fld not specified, obj with all flds returned
// if defaultVal is specified, it will be returned if fld value is undefined
j19Rec.prototype.get = function( fld, defaultVal ) {
	if( !fld ) {  // return obj with all flds
		var rec = {};
		var fld;
		for(var i=0; i<this.def.flds.length; i++) {
			fld = this.def.flds[i];
			rec[fld] = this.vals[i];
		};
		return rec;
	}
	var fldNdx = this.def.fldNdx[fld];
	if( fldNdx == undefined ) {
		j19Error("get(fld) invalid field name - " + fld);
		return;
	}
	var val = this.vals[fldNdx];
	if( val == undefined && defaultVal ) {
		val = defaulVal;
	}
	return val;
}

// load multiple values from newVals object, change flags not set unless setChangFlag parm = true
j19Rec.prototype.load = function(newVals, setChangeFlag) {
	for(fld in newVals) {
		fldNdx = this.def.fldNdx[fld];
		if( fldNdx == undefined ) {
			j19Error("load() newVals has invalid fld: " + fld);
			return;
		}
		this.vals[fldNdx] = newVals[fld];
		if( setChangeFlag ) {
			this.fldChanged[fldNdx] = true;
		}
	}
	if( setChangeFlag ) {
		this.recChanged = true;
	}	
}

// set value of a specific field, using operation parm the old val is modified by the specified val (add, subtract, multiply)
// change flag is set unless noFlagChange = true
j19Rec.prototype.set = function( fld, val, operation, noFlagChange ) {
	var fldNdx = this.def.fldNdx[fld];

	if( fldNdx == undefined ) {  
		j19Error("set() invalid field=" + fld);
		return;
	}   
	if( val == undefined ) {
		j19Error("set() parm val is undefined, field=" + fldName);
		return;
	}
	if( !noFlagChange ) {
		this.recChanged = true;
		this.fldChanged[fldNdx] = true; 
	}      
	if( operation == undefined ) {
		this.vals[fldNdx] = val;
		return;
	}	
	var oldVal = this.get(fld, 0);
	if( isNaN(oldVal) ) {
		j19Error("set(), prev value is not a number, cannot " + operation);
		return;
	}
	switch( operation ) {
		case this.ADD:
			this.vals[fldNdx] = oldVal + val;
			break;
		case this.SUBTRACT:
			this.vals[fldNdx] = oldVal - val;
			break;
		case this.MULTIPLY:
			this.vals[fldNdx] = oldVal * val;
			break;
		default: 
			j19Error('set() invalid operation=' + operation);
	}
}

// establish join connection with related record, returns true if successful, else returns false
j19Rec.prototype.join = function( tblName ) {
	var relation = this.def.related[tblName];
	if( relation == undefined ) {
		j19Error('relate() tlbName is not related: ' + tblName);
		return;
	}
	var relatedTable = j19db[tblName];
	var joinFld = relation.join;
	var toFld = relation.to;
	var joinVal = this.get(joinFld);
	var relatedNdx = j19FindBinary( relatedTable, joinVal, toFld );
	if( relatedNdx == -1 ) {
		alert("join nomatch with findBinary, " + tblName + ", " + joinVal);
		relatedNdx = j19Find( relatedTable, joinVal, toFld );
	}
	if( relatedNdx == -1 ) {
		return false;
	}
	var fldName = "join_" + tblName;
	var noFlagChange = true;
	this.set( fldName, relatedNdx, undefined, noFlagChange );

	var relatedRec = relatedTable[relatedNdx];  // if related rec is a parent, myndx added to its children
	relatedRec.addChild( this.def.name, this.get('myndx') );  // if related not a parent, nothing is done
	return true;
}

// add index of child record to parent records child array
// if childName is not a child: returns with no action or error
j19Rec.prototype.addChild = function( childName, childNdx ) {
	if( !this.children[childName] ) {
		return;   // not a child
	}
	if( this.children[childName].j19GetNdx(childNdx) > -1 ) {
		return;  // child already loaded
	}
	this.children[childName].push(childNdx);	
}

// get value from related record, if fld parm not specified, obj with all fields is returned
// related rec must have been joined using this.join() first
j19Rec.prototype.getRelated = function( tblName, fld ) {
	if( !this.def.related[tblName] ) {
		j19Error("getRelated() not a related table: " + tblName);
		return;
	}
	var ndx = this.get("join_" + tblName);
	if( ndx == undefined ) {
		console.log("related ndx not set: " + tblName);
		return undefined;
	}
	var relatedRec = j19db[tblName][ndx];
	if( relatedRec == undefined ) {
		console.log("related rec not found: " + tblName + ":" + ndx);
		return undefined;
	}
	if(fld) {
		return relatedRec.get(fld);
	} else {	
		return relatedRec;
	}
}

// returns a copy of of child record indexes array
j19Rec.prototype.getChildren = function( childName ) {
	if( !this.children[childName] ) {
		j19Error("getChildren() not a child " + childName);
		return;
	}
	return this.children[childName].slice();	
}

// clear record & field changed flags (typically run after save operation)
// if fld is specified only that field's change flag is reset
j19Rec.prototype.clearChangedFlags = function( fld ) {
	if( fld ) { 
		var fldNdx = this.def.fldNdx[fld];
		this.fldChanged[fldNdx] = false;
		if( this.fldChanged.j19GetNdx(true) == -1 ) {  // no other flags are true
			this.recChanged = false;
		}
		return;
	}
	for(var i=0, cnt=this.fldChanged.length; i<cnt; i++) {
		this.fldChanged[i] = false;
	}
    this.recChanged = false;
}

// ---------------------------------------------------------------
//	DATASET FUNCTIONS
// ---------------------------------------------------------------

// call specified function for each record in data array passing j19Rec obj to func
// optional sortFilter specifies indexes of records to process and the order to process them
// if func returns true, loop will stop
function j19Loop( data, func, sortFilter ) {
	if( !sortFilter ) {
		var sortFilter = j19Sequence(data.length);
	}
	var recNdx, done;
	for( var i=0, cnt=sortFilter.length; i<cnt; i++ ) {
		recNdx = sortFilter[i];
		done = func( data[recNdx] );
		if( done ) break;
	}
}

// sequential search of data array, compares each rec's fld val with findVal, returns index of 1st match, if no match returns -1
// optional startNdx specifies index of rec to begin search
// if findVal is a string, compares lower case values
// if findVal is a date, compares val returned from date.getTime() (returns a number)

function j19Find( data, findVal, fld, startNdx ) {
	if( startNdx == undefined ) {
		var startNdx = 0;
	}
	if(findVal.toLowerCase) {
		findVal = findVal.toLowerCase();
		var strVal = true;
	}
	if( findVal instanceof Date ) {
		findVal = findVal.getTime();
		var dateVal = true;
	}		
	var ndx = -1;	
	var val;
	for( var i=startNdx, cnt=data.length; i<cnt; i++ ) {
		val = data[i].get(fld);
		if( strVal ) {
			val = val.toLowerCase();
		}
		if( dateVal ) {
			val = val.getTime();
		}	
		if( findVal == val ) {
			ndx = i;
			break;
		}
	}
	return ndx;
}

// binary search of data array, compares each rec's fld val with findVal, returns index of 1st match, if no match returns -1
// if findVal is a string, compares lower case values
// if findVal is a date, compares val returned from date.getTime() (a number)
// data must be already sorted by fld (typically primary key of table)
// if data is not sorted by fld, an optional sortOrder can be specified

function j19FindBinary( data, findVal, fld, sortOrder ) {
	if( !sortOrder ) {
		var sortOrder = j19Sequence(data.length);
	}
	if( findVal.toLowerCase ) {
		findVal = findVal.toLowerCase();
		var strVal = true;
	}
	if( findVal instanceof Date ) {
		findVal = findVal.getTime();
		var dateVal = true;
	}		
	var ndx, val;
	var matchNdx = -1;
	var startNdx = 0;
	var endNdx = sortOrder.length - 1;
	while( startNdx <= endNdx ) {
		ndx = Math.floor( (startNdx + endNdx) / 2);
		val = data[sortOrder[ndx]].get(fld);
		if( strVal )
			val = val.toLowerCase();
		if( dateVal )
			val = val.getTime();
		if( val === findVal ) {
			matchNdx = sortOrder[ndx];
			break;
		}	
		if( val > findVal )
			endNdx = ndx - 1;
		else
			startNdx = ndx + 1;
	}
	return matchNdx;
}

// calls specified function with each record in data array
// optional sortFilter specifies which records to process and order to process them
// if func returns true, then ndx of record is added to results array
// returned value (results array) contains indexes of records that met query criteria

function j19Qry( data, func, sortFilter ) {
	if( !sortFilter ) {
		var sortFilter = j19Sequence(data.length);
	}
	var results = [];
	var ndx;
	for( var i=0, cnt=data.length; i<cnt; i++ ) {
		ndx = sortFilter[i];
		if( func(data[ndx]) ) {
			results.push( ndx );
		}
	}
	return results;
}

// return array of data indexes in sorted order
// keys parm is array of key field names, ex. ["class", "name"], in order from highest to lowest level
// optional filter specifies array of data indexes to include in sort (typically resulf of a qry)
// ** the actual data records are not moved by this function **

function j19Sort( data, keys, filter) {
	var dataNdxs;  // array of index values that will be sorted and returned
	if( filter ) {
		dataNdxs = filter.slice();
	} else {
		dataNdxs = j19Sequence(data.length);
	}
	var keyFlds = [];
	var related = [];
	var descending = [];
	var x, keyFld;	
	for( var i=0, cnt=keys.length; i<cnt; i++ ) {
		x = keys[i].indexOf(':d');
		if( x == -1 ) {
			keyFld = keys[i];
			descending[i] = false;
		} else {
			keyFld = keys[i].substr( 0, x );
			descending[i] = true;
		}
		x = keyFld.indexOf('.');
        if( x == -1 ) {
        	related[i] = null;
        	keyFlds[i] = keyFld;
        } else {	
        	related[i] = keyFld.substr( 0, x );
        	keyFlds[i] = keyFld.substr( x + 1 );	
        } 		
	}
	var sortReturn, keya, keyb;
	var keyCnt = keys.length;
    dataNdxs.sort(function(a,b) {
        for(var i=0; i<keyCnt; i++) {
       		if( related[i] == null ) {
				keya = data[a].get( keyFlds[i] );
        		keyb = data[b].get( keyFlds[i] );
        	} else {
        		keya = data[a].getRelated( related[i], keyFlds[i] );
        		keyb = data[b].getRelated( related[i], keyFlds[i] );
        	}
			sortReturn = keya > keyb ? 1 : keya < keyb ? -1 : 0;
			if( sortReturn != 0 ) {
				if( descending[i] ) {
					sortReturn *= -1;
				}
				break;
			}	
		}
		return sortReturn;
	});
    return dataNdxs;
}
/*
==================================================================
   j19Sum Object
	sums data values and ouputs an array of j19Rec objects with totals
	output array can be used for further processing

	sumdef parm: parameters controlling sum process
	datadef parm: defines output recs
==================================================================
*/
function j19Sum(keyFlds, sumFlds, datadef) {
	if( !(datadef instanceof j19DataDef) ) {
		j19Error( "Sum 2nd parm not a j19DataDef" );
		return;
	}
	this.datadef = datadef;  // for output
	this.keyflds = keyFlds;
	this.sumflds = sumFlds;
	this.totals = {};
	this.keyvals = {};
	this.isdatekey = [];
	this.keycnt = this.keyflds.length;
}
j19Sum.prototype.sum = function(data, sortFilter) {
	var thisObj = this;
	j19db[this.datadef.name].length = 0;    // clear output data array
	var keyfld, sumfld;
	// init totals (key1: {sumfld1:0, sumfld2:0})
	for(var i=0; i<this.keycnt; i++) {
		keyfld = this.keyflds[i];
		this.totals[keyfld] = {};
		for(var z=0; z<this.sumflds.length; z++) {
			sumfld = this.sumflds[z];	
			this.totals[keyfld][sumfld] = 0;
		}
		if(data[0].get(keyfld) instanceof Date) {
			this.isdatekey[i] = true;
		} else {
			this.isdatekey[i] = false;
		}
	}
	var recvals, keyfld, compareval;
	var firstPass = true;
	j19Loop(data, function(rec) {
		recvals = rec.get();
		if( firstPass ) {
			firstPass = false;
			thisObj.setKeyVals(recvals);
		}
		// compare all keys, if any change, write total records
		// begin compares with top level key (keyflds[0])		
		for( var keyndx=0; keyndx < thisObj.keycnt; keyndx++ ) {
			keyfld = thisObj.keyflds[keyndx];
			if( thisObj.isdatekey[keyndx] ) {
				compareval = recvals[keyfld].getTime();
			} else {
				compareval = recvals[keyfld];
			}
			if( compareval != thisObj.keyvals[keyfld] ) { 
				thisObj.writeTotals(keyndx);
				thisObj.setKeyVals(recvals);
				break;
			}	
		}
		// add current record to totals
		for( var i=0; i<thisObj.keycnt; i++ ) {
			for( var z=0; z<thisObj.sumflds.length; z++ ) {
				sumfld = thisObj.sumflds[z];
				thisObj.totals[keyfld][sumfld] += recvals[sumfld];
			};
		};
		console.table(thisObj.totals);
	}, sortFilter)
	
	this.writeTotals(0);
}

// ex. keyflds = ["region", "salesman", "customer"]
// highest level key is keyflds[0]  (region)
// lowest level key is keyflds[keycnt-1] (customer)
// write total recs for each key at or below keyChangeLevel, begininng with the lowest
// ex. if region changes, 3 output recs (customer, salesman, region)

j19Sum.prototype.writeTotals = function(keyChangeLevel) {
	var thisObj = this;
	var outdata = {};
	var outrec, key, keytotals;
	for(var keyno = this.keycnt-1; keyno >= keyChangeLevel; keyno--) {
		key = this.keyflds[keyno];
		keytotals = this.totals[key];
		this.keyflds.forEach(function(keyfld) {
			outdata[keyfld] = thisObj.keyvals[keyfld];
		});	
		this.sumflds.forEach(function(sumfld) {
			outdata[sumfld] = keytotals[sumfld];
			keytotals[sumfld] = 0;
		});
		this.keyvals[key] = null;

		outrec = new j19Rec(this.datadef, outdata);
		outrec.add();
	}
}
j19Sum.prototype.setKeyVals = function(recvals) {
	var keyfld;
	for( var i=0; i<this.keycnt; i++ ) {
		keyfld = this.keyflds[i];
		if( this.isdatekey[i] ) {
			this.keyvals[keyfld] = recvals[keyfld].getTime();
		} else {
			this.keyvals[keyfld] = recvals[keyfld];
		}
	};
}
