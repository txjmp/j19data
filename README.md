#j19Data.js

##A single javascript library providing relational data features.

Overview of How It Works

Each data table has a Data Definition object. For example:
	empSettings = {
		name: "emp",
		flds: ["id", "name", "job_id"],
		related: {
			job: {join:"job_id", to:"id"}
		},
		children: ["paycheck"]
	}
	These settings (object literal) are used to create instances of j19DataDef objects.
	j19EmpDef = new j19DataDef(empSettings);

Individual data records are also objects (instances of j19Rec) which have a reference to the DataDef.

Data records are statically joined together. For example:
	j19db.emp[x].join("job")
	find the record in j19db.job where id = job_id in the emp record
    the index of the job record is stored in the emp record