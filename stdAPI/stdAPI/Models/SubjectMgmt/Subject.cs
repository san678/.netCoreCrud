using stdAPI.Models.FacultyMgmt;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace stdAPI.Models.SubjectMgmt
{
    public class Subject
    {
        [Key]
        public string subjectId { get; set; }
        public string subjectName { get; set; }
        public int subjectYear { get; set; }

        public string departmentName { get; set; }

        [ForeignKey("departmentName")]
        public Faculty Faculty { get; set; }
    }
}
