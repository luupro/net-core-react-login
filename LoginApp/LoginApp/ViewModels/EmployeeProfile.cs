using AssignmentManagementSystem.ViewModels.BaseModels;

namespace AssignmentManagementSystem.ViewModels
{
    public class EmployeeProfile : BaseViewEmployee
    {
        public string Role { get; set; }

        public string MajorClassId { get; set; }
    }
}