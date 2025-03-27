import React, {useState, useEffect} from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library
import IconButton from "@mui/material/IconButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Title } from '@mui/icons-material';
import Swal from "sweetalert2";

import * as d3 from 'd3';

function AddStudent() {

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState(""); 
    const [address, setAddress] = useState("");
    const [faculty, setFaculty] = useState("");
    const [faculties, setFaculties] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(()=>{
      fetchStudents();
      fetchFaculties();
    }, []);

    useEffect(() => {
      if (students.length > 0) {
        updatePieChart();
      }
    }, [students]); 

    const groupStudentsByFaculty = () => {
      // Grouping students by faculty and counting the number of students per faculty
      const facultyCount = students.reduce((acc, student) => {
        acc[student.faculty] = (acc[student.faculty] || 0) + 1;
        return acc;
      }, {});
  
      // Convert the grouped data into an array for D3
      return Object.keys(facultyCount).map((faculty) => ({
        name: faculty,
        value: facultyCount[faculty],
      }));
    };
  
    const updatePieChart = () => {
      const data = groupStudentsByFaculty();
  
      const width = 928;
      const height = Math.min(width, 500);
      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.name))
        .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
  
      const pie = d3.pie().sort(null).value((d) => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);
      const labelRadius = arc.outerRadius()() * 0.8;
      const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
      const arcs = pie(data);
  
      // Clear previous chart
      d3.select("#pie-chart").selectAll("*").remove();
  
      const svg = d3
        .select("#pie-chart")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
  
      svg
        .append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d) => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text((d) => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);
  
      svg
        .append("g")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
        .call((text) =>
          text
            .append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text((d) => d.data.name)
        )
        .call((text) =>
          text
            .filter((d) => d.endAngle - d.startAngle > 0.25)
            .append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text((d) => d.data.value.toLocaleString("en-US"))
        );
    };
    
    const fetchStudents = () => {
      axios.get("https://localhost:7111/api/Student/GetStudent")
      .then((res) =>{
        setStudents(res.data);
      })
      .catch((err) =>{
        console.log(err);
      });
    }

    const filterStudents = students.filter(
      (student) =>
        student.name &&
        student.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const handleEditClick = (student) => {
      setSelectedStudent(student);
      setOpenEdit(true);
    };

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    const fetchFaculties = () => {
      axios.get("https://localhost:7111/api/Faculty/GetFaculty")
      .then((res) => {
        setFaculties(res.data);
      })
      .catch((err) => {
        console.error("Error fetching faculties:", err);
      });
    }

    const getFacultyname = (facultyName) =>{
      const faculty = faculties.find((fac)=> fac.facultyName === facultyName);
      return faculty ? faculty.facultyName : "";
    }
    function AddButton(e){
        e.preventDefault();

        const newStudent = {
          studentID: uuidv4(),
            name,
            age: parseInt(age),
            email,
            address,
            faculty,
        }
        axios.post("https://localhost:7111/api/Student/AddStudent", newStudent)
        // console.log(newStudent)
        .then(()=>{

            setName("");
            setAge("");
            setEmail("");
            setAddress("");
            setFaculty("");

            alert("Student Added Successfully");
            fetchStudents();
            handleCloseDialog();            
        }).catch((err)=>{
            console.log(err);
        })
    }

    const deleteButton = (student) => {
      Swal.fire({
        title : "Are you sure you want to delete this student?",
        text : "You won't be able to revert this!",
        icon : "warning",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Yes, delete it!",
      }).then((result) => {
        if(result.isConfirmed){
          axios.delete(`https://localhost:7111/api/Student/DeleteStudent/${student.studentID}`)
          .then((res) => {
            setStudents(students.filter((s) => s.studentID !== student.studentID));
            Swal.fire("Deleted!", "Student has been deleted.", "success");
          })
          .catch((err) =>{
            console.error("Error: ", err);
            Swal.fire("Error!", "An error occured in deleting the student.", "error");
          });
        }
      });
    };

    const Update = () => {
      axios.put(`https://localhost:7111/api/Student/UpdateStudent/${selectedStudent.studentID}`, selectedStudent)
      .then((res) =>{
        setStudents(
          students.map((student) => 
            student.studentID === selectedStudent.studentID ? selectedStudent : student
          )
        );
        fetchStudents();
        setSelectedStudent(null);
        setOpenEdit(false);
          })
          .catch((err) =>{
            console.log(err);
          });
    };

    return(
      <React.Fragment>
        <CssBaseline />
        <div>
      <Container maxWidth="x1" sx={{bgcolor:"#f0f0f0", minHeight: '100vh', py:4}}>
      <Box mb={2} mt={2}> {/* Add margin bottom for space */}
        <Grid container justifyContent="space-between" alignItems="center">
          
          <Grid item>
            <TextField
              id="outlined-basic"
              label="Search Students Here"
              size="small"
              onChange={(e) => {
                setStudentSearch(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <IconButton
              color="warning"
              aria-label="upload picture"
              component="span"
              size="large"
              onClick={handleOpenDialog}
            >
              <PersonAddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogContent>
            <Grid>
              <TextField
                id="outlined-basic"
                label="Student Name"
                variant="outlined"
                value={name}
                required
                fullWidth
                inputProps={{ maxLength: 100 }}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={email}
                required
                fullWidth
                inputProps={{ maxLength: 100 }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic"
                label="Age"
                variant="outlined"
                value={age}
                required
                fullWidth
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  setAge(e.target.value);
                }}
              />
              <br />
              <br />
              <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                value={address}
                required
                fullWidth
                inputProps={{ maxLength: 100 }}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
              <br />
              <br />
              <TextField
                select
                label="Faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                fullWidth
                //required
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.facultyName} value={faculty.facultyName}>
                    {faculty.facultyName}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <br />
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={AddButton} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#2f1036",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  STUDENT NAME
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#2f1036",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  STUDENT EMAIL
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#2f1036",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  AGE
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#2f1036",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  ADDRESS
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#2f1036",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  FACULTY
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#2f1036",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterStudents.map((students, key) => (
                <TableRow
                  key={key}
                  sx={{
                    backgroundColor: key % 2 === 0 ? "#e8cfe8" : "#f7f5f7",
                  }}
                >
                  <TableCell align="left">{students.name}</TableCell>
                  <TableCell align="left">{students.email}</TableCell>
                  <TableCell align="left">{students.age}</TableCell>
                  <TableCell align="left">{students.address}</TableCell>
                  <TableCell align="left">{students.faculty}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleEditClick(students)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => deleteButton(students)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <Container>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Student Name"
                  variant="outlined"
                  value={selectedStudent?.name}
                  required
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => {
                    setSelectedStudent({
                      ...selectedStudent,
                      name: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  value={selectedStudent?.email}
                  required
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => {
                    setSelectedStudent({
                      ...selectedStudent,
                      email: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Age"
                  variant="outlined"
                  value={selectedStudent?.age}
                  required
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => {
                    setSelectedStudent({
                      ...selectedStudent,
                      age: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Address"
                  variant="outlined"
                  value={selectedStudent?.address}
                  required
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => {
                    setSelectedStudent({
                      ...selectedStudent,
                      address: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Faculty"
                  fullWidth
                  value={selectedStudent?.faculty || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      faculty: e.target.value,
                    })
                  }
                >
                  {faculties.map((faculty) => (
                    <MenuItem key={faculty.facultyName} value={faculty.facultyName}>
                      {faculty.facultyName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
        </Container>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="error">
            Cancel
          </Button>
          <Button onClick={Update} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <svg id="pie-chart"></svg>
    </div>
      </React.Fragment>
    )
}

export default AddStudent;