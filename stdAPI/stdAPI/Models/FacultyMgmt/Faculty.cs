using System.ComponentModel.DataAnnotations;

namespace stdAPI.Models.FacultyMgmt
{
    public class Faculty
    {
        [Key]
        public string facultyName { get; set; }
        public string departmentName { get; set; }
    }
}
