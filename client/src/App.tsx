import { useEffect, useState } from "react";
import "./App.css";

type TEmployeeData = {
  id?: number;
  name: string;
  department_id: number;
};

function App() {
  const [employees, setEmployees] = useState<TEmployeeData[]>([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch("/api/employees");
        const json = await response.json();
        console.log(json);
        setEmployees(json);
      } catch (error) {}
    };
    fetchEmployeeData();
  }, []);

  return (
    <div className="bg-base-300">
      <h1 className="flex text-4xl justify-center px-4 py-16 bg-base-200">
        HR Directory
      </h1>
      <div className="w-1/2 mx-auto">
        <table className="table flex">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Department ID</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => {
              return (
                <tr>
                  <th>{index++}</th>
                  <td>{employee.name}</td>
                  <td>{employee.department_id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
