using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace stdAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFacultyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Faculties",
                columns: table => new
                {
                    facultyName = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    departmentName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Faculties", x => x.facultyName);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Faculties");
        }
    }
}
