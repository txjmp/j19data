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
.get(fld, defaultVal) - return value of requested field, defaultVal (optional) if val is undefined, return it  
.set(fld, val, operation, noFlagChange) - set fld to val  
&nbsp; &nbsp; operation (optional) - "add" to, "subtract" from, "multiply" by previous val  
&nbsp; &nbsp; can use constants j19Rec.ADD, .SUBTRACT, .MULTIPLY  
&nbsp; &nbsp; noFlagChange (optional) if true, don't set change flag  
.load(newVals, noFlagChange) - set multiple values, newVals is obj {fld:newval}  
.join(tblName) - join this rec to related rec in tblName  
&nbsp; &nbsp; tblName is string with name of table (data type) to join to  
&nbsp; &nbsp; index of related record is saved in this record  
&nbsp; &nbsp; if this record is a child of the related record, this.myndx is loaded into parent's rec  
&nbsp; &nbsp; .join needs only to be run once for each related record type  
.getRelated(tblName, fld) - get value from related record (join must have been executed first)   
.getChildren(tblName) - returns array of rec indexes for specified child rec  
.clearChangedFlags(fld) - clears rec and fld changed flags  
&nbsp; &nbsp; fld (optional) - clear change flag just for this field  

##Dataset Functions  
j19Loop( data, func, sortFilter )
* data - 
* func - 
* sortFilter - 








