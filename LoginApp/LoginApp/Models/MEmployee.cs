using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssignmentManagementSystem.Models
{
    //[Table("dbo.M_Employee")]
    public class MEmployee
    {
        [Key]
        public string EmployeeId { get; set; }

        public string EmployeeName { get; set; }

        public string EmployeeNameKana { get; set; }

        public string DomainUserName { get; set; }

        public string Department { get; set; }

        public string DepartmentName { get; set; }

        public string ClassId { get; set; }

        public int ClassNumber { get; set; }

        public string MajorClassId { get; set; }

        public string Email { get; set; }

        public DateTime? JoinDate { get; set; }
        
        public bool RetireFlag { get; set; }
    }
}