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
		{id:2, paycheck_id:1, paycode_id:2, amt:50},
		{id:3, paycheck_id:1, paycode_id:3, amt:20},
		{id:4, paycheck_id:2, paycode_id:1, amt:500},
		{id:5, paycheck_id:2, paycode_id:2, amt:50},
		{id:6, paycheck_id:2, paycode_id:3, amt:20},
		{id:7, paycheck_id:3, paycode_id:1, amt:500},
		{id:8, paycheck_id:3, paycode_id:2, amt:50},
		{id:9, paycheck_id:3, paycode_id:3, amt:20},
		{id:10, paycheck_id:4, paycode_id:1, amt:500},
		{id:11, paycheck_id:4, paycode_id:2, amt:50},
		{id:12, paycheck_id:4, paycode_id:3, amt:20}
	],
	paycode: [
		{id:1, name:"base pay", type:"earning"},
		{id:2, name:"fed tax", type:"tax"},
		{id:3, name:"ins", type:"deduction"}
	]
}