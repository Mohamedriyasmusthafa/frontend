const API_URL = "http://localhost:5000/api";

// =====================
// 🔐 Login
// =====================
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.setItem("role", data.role);
        if (data.role === "admin") window.location.href = "admin.html";
        else window.location.href = "index.html";
      } else {
        document.getElementById("error").innerText = data.error;
      }
    } catch (err) {
      document.getElementById("error").innerText = "Server error";
    }
  });
}

// =====================
// 🔓 Logout Button
// =====================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

// =====================
// 📋 Load Students (Staff & Admin)
// =====================
async function loadStudents() {
  const tableBody = document.querySelector("#studentsTable tbody");
  if (!tableBody) return;

  try {
    const res = await fetch(`${API_URL}/students`);
    const students = await res.json();

    tableBody.innerHTML = "";
    students.forEach(stu => {
      tableBody.innerHTML += `
        <tr>
          <td>${stu.id}</td>
          <td>${stu.name}</td>
          <td>${stu.roll_no}</td>
          <td>${stu.email}</td>
          <td>${stu.class}</td>
          <td>${stu.section}</td>
          <td>${stu.age}</td>
          <td>${stu.address}</td>
          ${document.getElementById("addForm") ? `<td><button onclick="deleteStudent(${stu.id})">Delete</button></td>` : ""}
        </tr>
      `;
    });
  } catch (err) {
    alert("Failed to load students");
  }
}

// =====================
// ➕ Add Student (Admin)
// =====================
const addForm = document.getElementById("addForm");
if (addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const student = {
      name: document.getElementById("name").value,
      roll_no: document.getElementById("roll_no").value,
      email: document.getElementById("email").value,
      age: document.getElementById("age").value,
      class: document.getElementById("class").value,
      section: document.getElementById("section").value,
      address: document.getElementById("address").value
    };

    try {
      const res = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
      const data = await res.json();
      alert(data.id ? "Student added!" : data.error);
      addForm.reset();
      loadStudents();
    } catch (err) {
      alert("Failed to add student");
    }
  });
}

// =====================
// ❌ Delete Student (Admin)
// =====================
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  try {
    const res = await fetch(`${API_URL}/students/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.deleted ? "Student deleted!" : data.error);
    loadStudents();
  } catch (err) {
    alert("Failed to delete student");
  }
}

// =====================
// Load students on page load
// =====================
window.onload = () => {
  const role = localStorage.getItem("role");
  if ((window.location.pathname.includes("index.html") || window.location.pathname.includes("admin.html")) && !role) {
    window.location.href = "login.html";
  }
  loadStudents();
};
