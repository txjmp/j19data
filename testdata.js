// simulated data as would typically be received from a web service

var testdata = {
	emp: [
		{id:1, name:"Tom", job_id:2},
		{id:2, name:"Siana", job_id:1},
		{id:3, name:"Bud", job_id:1},
		{id:4, name:"Trish", job_id:1},
		{id:5, name:"Henri", job_id:3}
	],
	job: [
		{id:1, jobName:"wait staff", class:"non-exempt"},
		{id:2, jobName:"bartender", class:"non-exempt"},
		{id:3, jobName:"manager", class:"exempt"}
	],
	paycheck: [
		{id:1, emp_id: 1, paydate:"Oct 5, 2015"},
		{id:2, emp_id: 2, paydate:"Oct 5, 2015"},
		{id:3, emp_id: 3, paydate:"Oct 5, 2015"},
		{id:4, emp_id: 1, paydate:"Oct 12, 2015"}
	],
	payline: [
		{id:1, paycheck_id:1, paycode_id:1, amt:500},
		{id:2, paycheck_id:1, paycode_id:2, amt:-50},
		{id:3, paycheck_id:1, paycode_id:3, amt:-20},
		{id:4, paycheck_id:1, paycode_id:4, amt:100},
		{id:5, paycheck_id:1, paycode_id:5, amt:30},
		{id:6, paycheck_id:1, paycode_id:6, amt:-25},
		{id:7, paycheck_id:1, paycode_id:7, amt:-35},

		{id:8, paycheck_id:2, paycode_id:1, amt:500},
		{id:9, paycheck_id:2, paycode_id:2, amt:-50},
		{id:10, paycheck_id:2, paycode_id:3, amt:-20},
		{id:11, paycheck_id:2, paycode_id:4, amt:100},
		{id:12, paycheck_id:2, paycode_id:5, amt:30},
		{id:13, paycheck_id:2, paycode_id:6, amt:-25},
		{id:14, paycheck_id:2, paycode_id:7, amt:-35},

		{id:15, paycheck_id:3, paycode_id:1, amt:500},
		{id:16, paycheck_id:3, paycode_id:2, amt:-50},
		{id:17, paycheck_id:3, paycode_id:3, amt:-20},
		{id:18, paycheck_id:3, paycode_id:4, amt:100},
		{id:19, paycheck_id:3, paycode_id:5, amt:30},
		{id:20, paycheck_id:3, paycode_id:6, amt:-25},
		{id:21, paycheck_id:3, paycode_id:7, amt:-35},

		{id:22, paycheck_id:4, paycode_id:1, amt:500},
		{id:23, paycheck_id:4, paycode_id:2, amt:-50},
		{id:24, paycheck_id:4, paycode_id:3, amt:-20},
		{id:25, paycheck_id:4, paycode_id:4, amt:100},
		{id:26, paycheck_id:4, paycode_id:5, amt:30},
		{id:27, paycheck_id:4, paycode_id:6, amt:-25},
		{id:28, paycheck_id:4, paycode_id:7, amt:-35},
	],
	paycode: [
		{id:1, name:"base pay", type:"earning"},
		{id:2, name:"fed tax", type:"tax"},
		{id:3, name:"ins", type:"deduction"},
		{id:4, name:"commission", type:"earning"},
		{id:5, name:"bonus", type:"earning"},
		{id:6, name:"fica", type:"tax"},
		{id:7, name:"401k", type:"deduction"},
	]
}