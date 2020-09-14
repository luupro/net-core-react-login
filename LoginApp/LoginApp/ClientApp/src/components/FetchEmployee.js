import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';
import CustomDataTable from './custom-components/ReactDataTable/CustomDataTable.js';
import DataTable from 'react-data-table-component';

const tableColumns = [
{ name: 'EmployeeId', selector: 'employeeId', sortable: true, },
{ name: 'JoinDate', selector: 'joinDate', sortable: true, },
{ name: 'EmployeeName', selector: 'employeeName', sortable: true, },
{ name: 'DomainUserName', selector: 'domainUserName', sortable: true,},
{ name: 'MajorClassId', selector: 'majorClassId', sortable: true, },
];

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
            <DataTable
                keys="employeeId"
                columns={tableColumns}
                data={employees}
                defaultSortField={"employeeId"}
                defaultSortAsc={true}
                pagination={true}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                }}
            />
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
