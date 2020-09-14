using AssignmentManagementSystem.DAL;
using AssignmentManagementSystem.Interfaces;
using AssignmentManagementSystem.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace AssignmentManagementSystem.Services
{
    public class EmployeeService : IEmployeeService
    {
        private const bool Retired = false;

        private readonly CustomContext _context;

        public EmployeeService(CustomContext context)
        {
            _context = context;
        }

        public IAsyncEnumerable<EmployeeProfile> GetEmployeesData()
        {
            var result = from e in _context.MEmployees
                            where e.RetireFlag == Retired
                            orderby e.EmployeeId
                            select new EmployeeProfile
                            {
                                EmployeeId = e.EmployeeId,
                                EmployeeName = e.EmployeeName,
                                MajorClassId = e.MajorClassId,
                                ClassId = e.ClassId,
                                DomainUserName = e.DomainUserName,
                                JoinDate = e.JoinDate
                            };
            return result.AsAsyncEnumerable();
        }
    }
}