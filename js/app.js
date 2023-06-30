import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getDatabase, ref, push, query, orderByChild, equalTo, get,set,child } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyAw8fvcLrczrRvbQH1KXwGIG9hmMoFTBh0",
    authDomain: "student-teacher-booking.firebaseapp.com",
    databaseURL: "https://student-teacher-booking-default-rtdb.firebaseio.com",
    projectId: "student-teacher-booking",
    storageBucket: "student-teacher-booking.appspot.com",
    messagingSenderId: "356501913594",
    appId: "1:356501913594:web:5d106b6f440ce2c28dee43",
    measurementId: "G-HGYK6VHGWS"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the Firebase database
const database = getDatabase();

// Get the current page URL
const currentPage = window.location.pathname;
console.log('Current Page:', currentPage);

// Get the form element
const form = document.querySelector('form');

// Function to register a student
function registerStudent() {
  console.log('Registering student...');
  // Get the input values
  const name = document.getElementById('name').value;
  const department = document.getElementById('department').value;
  const password = document.getElementById('password').value;
  const studentNumber = document.getElementById('student-number').value;

  // Create a new student object
  const student = {
    name: name,
    department: department,
    password: password,
    studentNumber:studentNumber
  };

  // Save the student data to the Firebase database
  const studentsRef = ref(database, 'students');
  const studentNumberRef = child(studentsRef, studentNumber);
  set(studentNumberRef, student)
    .then(function() {
      console.log('Student registered successfully!');
      // Clear the form after successful registration
      form.reset();
    })
    .catch(function(error) {
      console.error('Error registering student:', error);
    });
}

// Add an event listener to the form submit event if not on login page
if (currentPage === '/admin/add_Teacher.html') {
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the input values
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const subject = document.getElementById('subject').value;
    const password = document.getElementById('password').value;
    const teacherNumber = document.getElementById('teacher-number').value;

    // Create a new teacher object
    const teacher = {
      name: name,
      department: department,
      subject: subject,
      password: password,
      teacherNumber:teacherNumber
    };

    // Save the teacher data to the Firebase database
    const teachersRef = ref(database, 'teachers');
    //console.log(teachersRef);
    const teacherNumberRef = child(teachersRef, teacherNumber);
    //console.log(teacherNumberRef);
    set(teacherNumberRef, teacher)
      .then(function() {
        console.log('Teacher added successfully!');
        // Clear the form after successful submission
        form.reset();
      })
      .catch(function(error) {
        console.error('Error adding teacher:', error);
      });
  });
} else if (currentPage === '/login.html') {
  document.getElementById('login-btn').addEventListener('click', function() {
    // Get the selected user role
    const studentCheckbox = document.getElementById('student-checkbox');
    const teacherCheckbox = document.getElementById('teacher-checkbox');
    const adminCheckbox = document.getElementById('admin-checkbox');

    if (studentCheckbox.checked) {
      // User selected Student role, authenticate against the student database
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Get the reference to the students table in Firebase
      const studentsRef = ref(database, 'students');

      // Query the students table for the entered username
      const queryRef = query(studentsRef, orderByChild('name'), equalTo(username));

      // Retrieve the student with the matching username
      get(queryRef)
        .then(function(snapshot) {
          // Check if a student with the entered username exists
          if (snapshot.exists()) {
            // Get the student object
            const student = snapshot.val()[Object.keys(snapshot.val())[0]];

            // Check if the entered password matches the student's password
            if (student.password === password) {
              // Authentication successful, redirect to book_Appointment.html
              window.location.href = "Student/book_Appointment.html";
            } else {
              console.error('Invalid password');
            }
          } else {
            console.error('Student not found');
          }
        })
        .catch(function(error) {
          console.error('Error retrieving student data: ', error);
        });
    } else if (teacherCheckbox.checked) {
      // User selected Teacher role, authenticate against the teacher database
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Get the reference to the teachers table in Firebase
      const teachersRef = ref(database, 'teachers');

      // Query the teachers table for the entered username
      const queryRef = query(teachersRef, orderByChild('name'), equalTo(username));

      // Retrieve the teacher with the matching username
      get(queryRef)
        .then(function(snapshot) {
          // Check if a teacher with the entered username exists
          if (snapshot.exists()) {
            // Get the teacher object
            const teacher = snapshot.val()[Object.keys(snapshot.val())[0]];

            // Check if the entered password matches the teacher's password
            if (teacher.password === password) {
              // Authentication successful, redirect to view_appointments.html
              window.location.href = "Teacher/view_Appointments.html";
            } else {
              console.error('Invalid password');
            }
          } else {
            console.error('Teacher not found');
          }
        })
        .catch(function(error) {
          console.error('Error retrieving teacher data: ', error);
        });
    } else if (adminCheckbox.checked) {
      // User selected Admin role, authenticate against the admin credentials
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Check if the entered username and password match the admin credentials
      if (username === 'admin' && password === 'admin') {
        // Authentication successful, redirect to admin page
        window.location.href = "admin/add_Teacher.html";
      } else {
        console.error('Invalid username or password');
      }
    } else {
      // No user role selected, display an error message or handle accordingly
      console.error('Please select a user role.');
    }
  });
} else if (currentPage === '/Student/register.html') {
  console.log('Current Page:', currentPage);
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
    console.log('Register form submitted!');
    registerStudent(); // Call the registerStudent function
  });
}