#Browser Side Relational Data Manager  
 
The purpose of this javascript module is to provide client side ( in browser ) data interaction capability. The following functionality is included:  

* find  - sequential or binary search
* query - get result set using complex conditions including values from related tables
* modify - tracks data changes automatically
* sort - multiple keys, asc or desc, use values in related tables
* sum - total on multiple keys, includes subtotals  

Does not use sql. Very simple design. Data is not stored on the client device (in memory only). Does not perform automatic syncs with server database. The application controls when changes are sent to server and when local data is refreshed.  
  
Goal is to handle basic data access needs that would otherwise be difficult to accomplish in the browser. It in no way is intended to provide functionality comparable to a full blown sql database. Should work in any current browser.  
  
Use Case Attributes:  
* Single Page App
* Primary (server side) database provides persistent storage
* Primary db can be relational or simple key:value
* A subset of the primary db is sent to the client
    * team, dept, emp, customer, orders, in date range, etc.
* data can remain normalized (little duplication between tables)
* Data manipulation occurs on client
* Data changes sent to server on demand
  

