using AssignmentManagementSystem.ViewModels;
using System.Collections.Generic;

namespace AssignmentManagementSystem.Interfaces
{
    public interface IEmployeeService
    {
        IAsyncEnumerable<EmployeeProfile> GetEmployeesData();
    }
}
