using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssignmentManagementSystem.Interfaces;
using AssignmentManagementSystem.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LoginApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly ILogger<EmployeeController> _logger;
        protected readonly IEmployeeService _employeeService;

        public EmployeeController(ILogger<EmployeeController> logger, IEmployeeService employeeService)
        {
            _logger = logger;
            _employeeService = employeeService;
        }

        [HttpGet]
        public async IAsyncEnumerable<EmployeeProfile> Get()
        {
            var employeesData = _employeeService.GetEmployeesData();
            await foreach (var employee in employeesData)
            {
                yield return employee;
            }
        }
    }
}
