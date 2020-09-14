import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';

export class FetchEmployee extends Component {
    static displayName = FetchEmployee.name;

    constructor(props) {
        super(props);
        this.state = { employees: [], loading: true };
    }

    componentDidMount() {
        this.populateEmployeeData();
    }

    static renderEmployeesTable(employees) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>JoinDate</th>
                        <th>EmployeeName</th>
                        <th>DomainUserName</th>
                        <th>MajorClassId</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee =>
                        <tr key={employee.employeeId}>
                            <td>{employee.joinDate}</td>
                            <td>{employee.employeeName}</td>
                            <td>{employee.domainUserName}</td>
                            <td>{employee.majorClassId}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchEmployee.renderEmployeesTable(this.state.employees);

        return (
            <div>
                <h1 id="tabelLabel" >Employees</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async populateEmployeeData() {
        const token = await authService.getAccessToken();
        const response = await fetch('employee', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ employees: data, loading: false });
    }
}
