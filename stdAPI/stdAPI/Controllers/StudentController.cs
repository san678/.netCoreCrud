using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stdAPI.Models;
using System.Text.RegularExpressions;

namespace stdAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly StudentDbContext _studentDbContext;

        public StudentController(StudentDbContext studentDbContext)
        {
            _studentDbContext = studentDbContext;
        }

        [HttpGet]
        [Route("GetStudent")]
        public async Task<IEnumerable<Student>> GetStudents()
        {
            var students  = await _studentDbContext.Students.ToListAsync();

            foreach(var student in students)
            {
                student.name = capitalize(student.name);
                student.address = capitalize(student.address);
                student.faculty = capitalize(student.faculty);
            }
            return students;
        }

        [HttpPost]
        [Route("AddStudent")]
        public async Task<IActionResult> AddStudent([FromBody] Student objStudent)
        {
            if (objStudent == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid student data.");
            }

            _studentDbContext.Students.Add(objStudent);
            await _studentDbContext.SaveChangesAsync();
            return Ok(objStudent);
        }

        [HttpPut]
        [Route("UpdateStudent/{id}")]
        public async Task<Student> UpdateStudent(Student objStudent)
        {
            _studentDbContext.Entry(objStudent).State = EntityState.Modified;
            await _studentDbContext.SaveChangesAsync();
            return objStudent;
        }


        [HttpDelete]
        [Route("DeleteStudent/{id}")]
        public bool DeleteStudent(string id)
        {
            bool a = false;
            var student = _studentDbContext.Students.Find(id);

            if (student != null)
            {
                a = true;
                _studentDbContext.Entry(student).State = EntityState.Deleted;
                _studentDbContext.SaveChanges();
            }
            else
            {
                a = false;
            }

            return a;
        }

        private string capitalize(string input)
        {
            if(string.IsNullOrEmpty(input))
                return input;
            return Regex.Replace(input.ToLower(), @"\b\w", m => m.Value.ToUpper());
        }
    }
}
