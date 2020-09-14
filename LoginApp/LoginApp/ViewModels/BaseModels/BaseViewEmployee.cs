using System;

namespace AssignmentManagementSystem.ViewModels.BaseModels
{
    public class BaseViewEmployee
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string DomainUserName { get; set; }
        public string ClassId { get; set; }
        public DateTime? JoinDate { get; set; }
    }
}