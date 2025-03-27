using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace stdAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentTaable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "faculty",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "faculty",
                table: "Students");
        }
    }
}
