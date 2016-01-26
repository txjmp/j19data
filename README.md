#j19Data.js

##A single javascript module providing relational data features.  

##Status  
Basically complete for version 1. Looking for others to give it a try and provide feedback. May consider API changes depending on responses.
Needs to be tested more thoroughly before any serious projects use it.
 
Example Showing How a Simple Query Works  

```
// select employees where jobName = "driver", jobName is stored in the "job" table

var selected = j19Qry( db.emp, function(emp) {
    if( emp.getRelated( "job", "jobName" ) == "driver" ) {
        return true; 
    } else {
        return false;
    }
});

// show emp name, jobName using qry result
j19Loop( db.emp, function(emp) {
    console.log( emp.get("name"), emp.getRelated("job", "jobName") );
}, selected);

```
##Links  
* [Intro](https://github.com/txjmp/j19data/blob/master/intro.md)  
* [Quick Start](https://github.com/txjmp/j19data/blob/master/Quick_Start.md)  
* [API](https://github.com/txjmp/j19data/blob/master/API.md)  
  
### Key Points  
1. Data records are instances of an object (j19Rec)  
2. These objects have a set of methods for interacting with them  
3. Records of the same type are stored in the same array  
4. Records can be joined to a record in a different array  
5. When a record is retrieved, values in joined records are also available
  
### Unique Concepts   
Records are not moved or removed from the array they were loaded into (until refreshed from server).  
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
Settings object literals are used to create instances of j19DataDef objects.  
ex. empDef = new j19DataDef(dataSettings[emp]);  

When individual data records are created a reference to the j19DataDef is stored in them.  
  
