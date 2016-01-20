#j19Data.js

##A single javascript module providing relational data features.  

### Key Points  
1. Data records are instances of an object (j19Rec)  
2. These objects have a set of methods for interacting with them  
3. Records of the same type are stored in the same array  
4. Records can be joined to a record in a different array  
5. When values are retrieved from a record, values in joined records are also available.  
  
### Unique Concepts   
Records are never moved or removed from the array they were loaded into (until refreshed from server).  
When joining records, the index of the related record is stored in the primary record.  
Child records use a similar but different approach.  

### SortFilters  
These are simply arrays of index numbers indicating what records to process and the order.   
For example: sortFilter = [9,3,4,1,2] - retrieve rec[9], rec[3], rec[4], etc.  
The j19Qry and j19Sort functions produce sortFilters.  
Most functions have the option of using a sortFilter.  

### Data Definitions  
    
Each record type has a Data Definition object. For example:  

```
dataSettings = {
	emp: {  
		name: "emp",  
		flds: ["id", "name", "job_id"],
		related: {
			job: {join:"job_id", to:"id"}
		},
		children: ["paycheck"]
	}
```
	These settings (object literal) are used to create instances of j19DataDef objects.  
	j19EmpDef = new j19DataDef(empSettings);  

Individual data records have a reference to the DataDef.  
  
Data records are statically joined together. For example: 
  
    j19db.emp[x].join("job")  
    find the record in j19db.job where id = job_id in the emp record  
    the index of the job record is stored in the emp record  
