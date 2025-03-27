using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stdAPI.Models;
using stdAPI.Models.FacultyMgmt;
using System.Text.RegularExpressions;

namespace stdAPI.Controllers.FacultyMgmt
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultyController : ControllerBase
    {
        private readonly StudentDbContext _facultyDbContext;

        public FacultyController(StudentDbContext facultyDbContext)
        {
            _facultyDbContext = facultyDbContext;
        }

        [HttpGet]
        [Route("GetFaculty")]
        public async Task<IEnumerable<Faculty>> GetFaculties()
        {
            var faculties = await _facultyDbContext.Faculties.ToListAsync();

            foreach (var faculty in faculties)
            {
                faculty.facultyName = capitalize(faculty.facultyName);
            }
            return faculties;
        }

        [HttpPost]
        [Route("AddFaculty")]
        public async Task<IActionResult> AddFaculty([FromBody] Faculty objFaculty)
        {
            if (objFaculty == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid faculty data.");
            }

            _facultyDbContext.Faculties.Add(objFaculty);
            await _facultyDbContext.SaveChangesAsync();
            return Ok(objFaculty);
        }
        private string capitalize(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;
            return Regex.Replace(input.ToLower(), @"\b\w", m => m.Value.ToUpper());
        }
    }
}
