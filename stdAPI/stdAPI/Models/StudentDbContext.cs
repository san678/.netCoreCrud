using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using stdAPI.Models.FacultyMgmt;
using stdAPI.Models.SubjectMgmt;

namespace stdAPI.Models
{
    public class StudentDbContext : DbContext
    {
        public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Subject> Subjects { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=SANDEEPAL\\SQLEXPRESS01;Initial Catalog=lbs;Persist Security Info=True;User ID=sa;Password=123;Trust Server Certificate=True");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Faculty>()
                .HasKey(f => f.facultyName);

            modelBuilder.Entity<Faculty>()
                .Property(f => f.departmentName)
                .IsRequired();

            modelBuilder.Entity<Subject>()
                .HasKey(s => s.subjectId);

            modelBuilder.Entity<Subject>()
                .HasOne(s => s.Faculty)
                .WithMany()
                .HasForeignKey(s => s.departmentName)
                .HasPrincipalKey(f => f.departmentName);
        }
    }
}

