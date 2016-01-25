#API

## j19DataDef - Data Definition Object  

Defines fields and relationships of data type.

```
dataDefSettings = {
	emp: {
		name: "emp",
		flds: ["id", "name", "job_id"],
		related: {
			job: {join:"job_id", to:"id"}
		},
		children: ["paycheck"],
	},
	job: {
		name: "job",
		flds: ["id", "jobName", "class"],
		related: {},
		children: [],
	}
}
dataDefs[emp] = new j19DataDef(dataDefSettings[emp]);
```

Attributes  
* name - used as name of data array in j19db object (j19db.emp[0] references 1st emp data rec)
* flds - array of field names 
* related - defines how records are joined
    * empRec.join("job") will find record in job array where emp.job_id = job.id
    * child records must include their parent records in the related value
    * this record should join with only 1 record in the related array
* children - defines which record types are children of this type, array of record names (strings)
    * child records are not included in parent's related value 
  
<hr>

##j19Rec
Every data record is an instance of this type.  
newRec = new j19Rec( dataDef, initVals )  
* dataDef is instance of j19DataDef
* initVals is optional, an object like {fldname1: val1, fldname2: val2, ...}, sets initial values of data record  
  
NOTE: moving or deleting a record from its data array will break relationships to other records

##j19Rec Methods  
.add() - adds this obj to j19db[dataDef.name], sets value of field myndx  
.get() - return obj containing all field values {fld1:val, fld2:val, ... }  
.get( fld, defaultVal ) - return value of requested field, defaultVal (optional) if val is undefined, return it  
.set( fld, val, operation, noFlagChange ) - set fld to val  
&nbsp; &nbsp; &nbsp; &nbsp; operation (optional) - "add" to, "subtract" from, "multiply" by previous val  
&nbsp; &nbsp; &nbsp; &nbsp; can use constants j19Rec.ADD, .SUBTRACT, .MULTIPLY  
&nbsp; &nbsp; &nbsp; &nbsp; noFlagChange (optional) if true, don't set change flag  
.load( newVals, noFlagChange ) - set multiple values, newVals is obj {fld:newval}  
.join( tblName ) - join this rec to related rec in tblName  
&nbsp; &nbsp; &nbsp; &nbsp; tblName is string with name of table (data type) to join to  
&nbsp; &nbsp; &nbsp; &nbsp; index of related record is saved in this record  
&nbsp; &nbsp; &nbsp; &nbsp; if this record is a child of the related record, this.myndx is loaded into parent's rec  
&nbsp; &nbsp; &nbsp; &nbsp; .join needs only to be run once for each related record type  
.getRelated( tblName, fld ) - get value from related record (join must have been executed first)   
&nbsp; &nbsp; &nbsp; &nbsp; if fld is not specified, reference to related j19Rec is returned  
.getChildren( tblName ) - returns array of rec indexes for specified child rec  
.clearChangedFlags( fld ) - clears rec and fld changed flags  
&nbsp; &nbsp; &nbsp; &nbsp; fld (optional) - clear change flag just for this field  

##Dataset Functions  
Following values are used for multiple functions.
* data - array containing j19Recs of desired rec type
* func - function called on each iteration thru data, reference to j19Rec is passed as parm
* sortFilter or filter - array of data index values to process, in order; ex. [5, 3, 8, 19]

j19Loop( data, func, sortFilter ) - call func for each rec in data  
&nbsp; &nbsp; &nbsp; &nbsp; sortFilter optional - if not specified, read all recs in natural order  
  
j19Find( data, findVal, fld, startNdx ) - sequential search for fld === findVal  
&nbsp; &nbsp; &nbsp; &nbsp; return rec index of 1st match  
&nbsp; &nbsp; &nbsp; &nbsp; startNdx (optional) - if not specified, starts at 0  
  
j19FindBinary( data, findVal, fld, sortOrder ) - binary search for fld === findVal  
&nbsp; &nbsp; &nbsp; &nbsp; data must be in order by fld (typically primary key)  
&nbsp; &nbsp; &nbsp; &nbsp; if not, an optional sortOrder can be used  
  
j19Qry( data, func, sortFilter ) - return array of indexes where func returns true  
  
j19Sort( data, keys, filter ) - return array of indexes in sorted order  
&nbsp; &nbsp; &nbsp; &nbsp; keys is array of fld names, ex. ["job.jobName", "name"]  
&nbsp; &nbsp; &nbsp; &nbsp; to specify descending order for key add :d, ex. "paydate:d"   
&nbsp; &nbsp; &nbsp; &nbsp; to use related value, prefix with tblName., ex "job.jobName"  
  
##j19Sum
Sum process works a little differently.  
Output of sum process is an array of j19Recs, which can be used for further processing.  
Steps  
1. Create settings (obj literal) that define data definition of output recs just like any other rec  
&nbsp; &nbsp; &nbsp; &nbsp; the flds array should be all the keyFlds + sumFlds + "count"   
2. Create j19DataDef using these settings  
3. Create instance of j19Sum  
4. Sort data array by keyflds (using j19Sort)
5. Execute .sum method ( data, sortFilter )  
Here is example code from test4.js:  

```
totalpaySettings = {   		// output of sum process
	name: "totalpay",		// j19db.totalpay - data rec array will be created when dataDef is created
	flds: ["paycode_id", "amt", "count"],
	related: {
		paycode: { join:"paycode_id", to:"id" }
	},
	children: []
}
var dataDef = new j19DataDef(totalpaySettings);

var keyflds = ["paycode_id"];
var sumflds = ["amt"];

var sumPay = new j19Sum( keyflds, sumflds, dataDef );

var sortOrder = j19Sort( db.payline, keyflds );

sumPay.sum( db.payline, sortOrder );

var out = {};
j19Loop( db.totalpay, function(totalpay) {
	totalpay.join("paycode");	
	out.paycodeType = totalpay.getRelated("paycode", "type");
	out.paycodeName = totalpay.getRelated("paycode", "name");
	out.total = totalpay.get("amt");
	console.log( out );
});

```




