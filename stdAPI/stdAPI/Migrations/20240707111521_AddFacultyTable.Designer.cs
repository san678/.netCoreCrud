﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using stdAPI.Models;

#nullable disable

namespace stdAPI.Migrations
{
    [DbContext(typeof(StudentDbContext))]
    [Migration("20240707111521_AddFacultyTable")]
    partial class AddFacultyTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("stdAPI.Models.FacultyMgmt.Faculty", b =>
                {
                    b.Property<string>("facultyName")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("departmentName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("facultyName");

                    b.ToTable("Faculties");
                });

            modelBuilder.Entity("stdAPI.Models.Student", b =>
                {
                    b.Property<string>("studentID")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("age")
                        .HasColumnType("int");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("studentID");

                    b.ToTable("Students");
                });
#pragma warning restore 612, 618
        }
    }
}
