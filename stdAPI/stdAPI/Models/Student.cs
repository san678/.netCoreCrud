using System.ComponentModel.DataAnnotations;

namespace stdAPI.Models
{
    public class Student
    {
        [Key]
        public string studentID { get; set; }
        public string name { get; set; }
        public int age { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public string faculty { get; set; }
    }
}
