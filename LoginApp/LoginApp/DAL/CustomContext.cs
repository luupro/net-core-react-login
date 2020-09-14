using AssignmentManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.DAL
{
    public class CustomContext : DbContext
    {
        public CustomContext(DbContextOptions<CustomContext> options)
        : base(options)
        { }

        public DbSet<MEmployee> MEmployees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MEmployee>().ToTable("M_Employee");
        }
    }
}