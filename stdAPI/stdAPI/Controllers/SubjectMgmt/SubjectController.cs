using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stdAPI.Models;
using stdAPI.Models.SubjectMgmt;
using stdAPI.Models.FacultyMgmt; // Ensure this using statement is present
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace stdAPI.Controllers.SubjectMgmt
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly StudentDbContext _subjectDbContext;

        public SubjectController(StudentDbContext subjectDbContext)
        {
            _subjectDbContext = subjectDbContext;
        }

        [HttpGet]
        [Route("GetSubject")]
        public async Task<IEnumerable<Subject>> GetSubjects()
        {
            var subjects = await _subjectDbContext.Subjects.ToListAsync();

            foreach (var subject in subjects)
            {
                subject.subjectName = capitalize(subject.subjectName);
            }
            return subjects;
        }

        [HttpPost]
        [Route("AddSubject")]
        public async Task<IActionResult> AddSubject([FromBody] Subject objSubject)
        {
            if (objSubject == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid subject data.");
            }

            var existingFaculty = await _subjectDbContext.Faculties
                .FirstOrDefaultAsync(f => f.departmentName == objSubject.departmentName);

            if (existingFaculty == null)
            {
                return BadRequest("The specified department does not exist.");
            }

            objSubject.Faculty = existingFaculty;

            _subjectDbContext.Subjects.Add(objSubject);
            try
            {
                await _subjectDbContext.SaveChangesAsync();
                return Ok(objSubject);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private string capitalize(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;
            return Regex.Replace(input.ToLower(), @"\b\w", m => m.Value.ToUpper());
        }
    }
}
