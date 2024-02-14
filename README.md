# Full Stack Web App for an HR Directory

### The back-end is all done and functional, instructions to run the server:

- open a terminal in the "server" directory, `cd server`
- install dependencies, `npm install`
- run the server, `npm run dev`

### Curl tests:

- `curl http://localhost:3000/api/employees` - GET request to fetch all employees
- `curl http://localhost:3000/api/departments` - GET request to fetch all departments
- `curl http://localhost:3000/api/employees/3 -X DELETE` - DELETE request to remove a single employee based on their ID
- `curl http://localhost:3000/api/employees/2 -X PUT -d '{"name": "John", "department_id": "5"}' -H "Content-Type:application/json"` - PUT request to update an employee's data
- `curl http://localhost:3000/api/employees/2 -X POST -d '{"name": "Brent", "department_id": "1"}' -H "Content-Type:application/json"` - POST request to add a new employee
