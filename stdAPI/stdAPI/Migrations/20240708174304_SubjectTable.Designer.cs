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
    [Migration("20240708174304_SubjectTable")]
    partial class SubjectTable
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
                        .HasColumnType("nvarchar(450)");

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

                    b.Property<string>("faculty")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("studentID");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("stdAPI.Models.SubjectMgmt.Subject", b =>
                {
                    b.Property<string>("subjectId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("departmentName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("subjectName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("subjectYear")
                        .HasColumnType("int");

                    b.HasKey("subjectId");

                    b.HasIndex("departmentName");

                    b.ToTable("Subjects");
                });

            modelBuilder.Entity("stdAPI.Models.SubjectMgmt.Subject", b =>
                {
                    b.HasOne("stdAPI.Models.FacultyMgmt.Faculty", "Faculty")
                        .WithMany()
                        .HasForeignKey("departmentName")
                        .HasPrincipalKey("departmentName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Faculty");
                });
#pragma warning restore 612, 618
        }
    }
}
