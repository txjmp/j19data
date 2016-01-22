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

##j19Rec Methods
.add() - adds obj to j19db[dataDef.name], sets value of field myndx 
.get() - return obj containing all fields
.get(fld, defaultVal) - return value of requested field, defaultVal (optional) if val is undefined, return it
.set(fld, val, operation, noFlagChange) - set fld to val  
    * operation (optional) - add, subtract, multiply previous value by val
    can use constants j19Rec.ADD, .SUBTRACT, .MULTIPLY  
	* noFlagChange (optional) if true, don't set change flag
.load(newVals, noFlagChange) - set multiple values, newVals is obj {fld:newval}

