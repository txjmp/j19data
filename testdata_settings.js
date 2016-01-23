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
	},
	outEmpPay: {   // output record of app function
		name: "outEmpPay",
		flds: ["emp_id", "paycheck_id", "paydate", "paycode_type", "paycode_name", "amt"],
		related: {
			emp: {join:"emp_id", to:"id"}
		},
		children: []
	}
}
