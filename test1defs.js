// Data Definition Settings, used to create j19DataDef objects

var dataDefSettings = {
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
	},
	paycheck: {
		name: "paycheck",
		flds: ["id", "emp_id", "paydate"],
		related: {
			emp: {join:"emp_id", to:"id"}   // parent
		},
		children: ["payline"]
	},
	payline: {
		name: "payline",
		flds: ["id", "paycheck_id", "paycode_id", "amt"],
		related: {
			paycheck: {join:"paycheck_id", to:"id"}, 	// parent
			paycode: {join:"paycode_id", to:"id"}
		},
		children: []
	},
	paycode: {
		name: "paycode",
		flds: ["id", "name", "type"],
		related: {},
		children: []
	}
}

/*
// Settings for j19SumDefs
salesSumSettings = {
	keyFlds: ["regionid", "salesmanid", "customerid"],
	sumFlds: ["salesAmt"],
}

var damDataDefs = {
	salesTotals: {
		name: "salesTotals",
		flds: ["regionid", "salesmanid", "customerid", "salesAmt"]
		related: {
			region:   {join:"regionid", to:"id"},
			salesman: {join:"salesmanid", to:"id"},
			customer: {join:"customerid", to:"id"},
		},
		children: [];
	}
}

loop payline
	ouput {paycheck.emp_id, paycode_id, amt
*/