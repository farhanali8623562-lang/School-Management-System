// ===============================
// NEW CITY SCHOOL MANAGEMENT SYSTEM
// ===============================


// ===============================
// STUDENT REGISTRATION
// ===============================

function showRegistration() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="form-container">
            <h2>Student Registration</h2>

            <form id="studentForm">

                <label for="gmr">GMR Number</label>
                <input type="text" id="gmr" required>

                <label for="studentName">Student Name</label>
                <input type="text" id="studentName" required>

                <label for="fatherName">Father Name</label>
                <input type="text" id="fatherName" required>

                <label for="dob">Date of Birth</label>
                <input type="date" id="dob">

                <label for="gender">Gender</label>
                <select id="gender">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label for="className">Class</label>
                <select id="className">
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Prep">Prep</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                </select>

                <label for="admissionDate">Admission Date</label>
                <input type="date" id="admissionDate">

                <label for="address">Address</label>
                <textarea id="address" rows="4"></textarea>

                <button type="submit">Save Student</button>

            </form>

            <div id="registrationMessage"></div>
        </div>
    `;

    document
        .getElementById("studentForm")
        .addEventListener("submit", saveStudent);
}


// ===============================
// SAVE STUDENT
// ===============================

async function saveStudent(event) {
    event.preventDefault();

    const studentData = {
        gmr: document.getElementById("gmr").value.trim(),
        studentName: document.getElementById("studentName").value.trim(),
        fatherName: document.getElementById("fatherName").value.trim(),
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        className: document.getElementById("className").value,
        admissionDate: document.getElementById("admissionDate").value,
        address: document.getElementById("address").value.trim()
    };

    try {
        const response = await fetch("/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        const message = document.getElementById("registrationMessage");

        if (response.ok) {
            message.innerHTML = `
                <div class="success-message">
                    Student saved successfully!
                </div>
            `;

            document.getElementById("studentForm").reset();
        } else {
            message.innerHTML = `
                <div class="error-message">
                    ${result.error || "Unable to save student."}
                </div>
            `;
        }

    } catch (error) {
        console.error(error);

        document.getElementById("registrationMessage").innerHTML = `
            <div class="error-message">
                Server connection error.
            </div>
        `;
    }
}


// ===============================
// SEARCH STUDENT
// ===============================

function showSearch() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="form-container">
            <h2>Search Student</h2>

            <form id="searchForm">

                <label for="searchGmr">GMR Number</label>
                <input
                    type="text"
                    id="searchGmr"
                    placeholder="Enter GMR Number"
                    required
                >

                <button type="submit">Search Student</button>

            </form>

            <div id="searchResult"></div>
        </div>
    `;

    document
        .getElementById("searchForm")
        .addEventListener("submit", searchStudent);
}


// ===============================
// SEARCH STUDENT DATA
// ===============================

async function searchStudent(event) {
    event.preventDefault();

    const gmr = document.getElementById("searchGmr").value.trim();
    const resultBox = document.getElementById("searchResult");

    if (!gmr) {
        resultBox.innerHTML = `
            <div class="error-message">
                Please enter GMR Number.
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(
            `/students/${encodeURIComponent(gmr)}`
        );

        const student = await response.json();

        if (!response.ok) {
            resultBox.innerHTML = `
                <div class="error-message">
                    ${student.error || "Student not found."}
                </div>
            `;
            return;
        }

        resultBox.innerHTML = `
            <div class="student-details">

                <h3>Student Information</h3>

                <p><strong>GMR Number:</strong> ${student.gmr}</p>
                <p><strong>Student Name:</strong> ${student.studentName}</p>
                <p><strong>Father Name:</strong> ${student.fatherName}</p>
                <p><strong>Date of Birth:</strong> ${student.dob || "-"}</p>
                <p><strong>Gender:</strong> ${student.gender || "-"}</p>
                <p><strong>Class:</strong> ${student.className || "-"}</p>
                <p><strong>Admission Date:</strong> ${student.admissionDate || "-"}</p>
                <p><strong>Address:</strong> ${student.address || "-"}</p>

            </div>
        `;

    } catch (error) {
        console.error(error);

        resultBox.innerHTML = `
            <div class="error-message">
                Server connection error.
            </div>
        `;
    }
}


// ===============================
// ALL STUDENTS
// ===============================

async function showAllStudents() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="students-container">
            <h2>All Students</h2>
            <p>Loading student records...</p>
        </div>
    `;

    try {
        const response = await fetch("/students");
        const students = await response.json();

        if (!response.ok) {
            content.innerHTML = `
                <div class="error-message">
                    Unable to load students.
                </div>
            `;
            return;
        }

        if (!students || students.length === 0) {
            content.innerHTML = `
                <div class="students-container">
                    <h2>All Students</h2>
                    <p>No student records found.</p>
                </div>
            `;
            return;
        }

        let tableRows = "";

        students.forEach(function (student) {
            tableRows += `
                <tr>
                    <td>${student.gmr}</td>
                    <td>${student.studentName}</td>
                    <td>${student.fatherName}</td>
                    <td>${student.className || "-"}</td>
                    <td>${student.gender || "-"}</td>
                    <td>${student.admissionDate || "-"}</td>

                    <td>
                        <div class="action-buttons">

                            <button
                                type="button"
                                class="edit-btn"
                                onclick="editStudent('${student.gmr}')"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteStudent('${student.gmr}')"
                            >
                                Delete
                            </button>

                        </div>
                    </td>
                </tr>
            `;
        });

        content.innerHTML = `
            <div class="students-container">

                <h2>All Students</h2>

                <div class="table-wrapper">

                    <table class="students-table">

                        <thead>
                            <tr>
                                <th>GMR</th>
                                <th>Student Name</th>
                                <th>Father Name</th>
                                <th>Class</th>
                                <th>Gender</th>
                                <th>Admission Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${tableRows}
                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {
        console.error(error);

        content.innerHTML = `
            <div class="error-message">
                Server connection error.
            </div>
        `;
    }
}


// ===============================
// EDIT STUDENT
// ===============================

async function editStudent(gmr) {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="form-container">
            <h2>Edit Student</h2>
            <p>Loading student information...</p>
        </div>
    `;

    try {
        const response = await fetch(
            `/students/${encodeURIComponent(gmr)}`
        );

        const student = await response.json();

        if (!response.ok) {
            content.innerHTML = `
                <div class="error-message">
                    ${student.error || "Student not found."}
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="form-container">

                <h2>Edit Student</h2>

                <form id="editStudentForm">

                    <label for="editGmr">GMR Number</label>
                    <input
                        type="text"
                        id="editGmr"
                        value="${student.gmr}"
                        readonly
                    >

                    <label for="editStudentName">Student Name</label>
                    <input
                        type="text"
                        id="editStudentName"
                        value="${student.studentName || ""}"
                        required
                    >

                    <label for="editFatherName">Father Name</label>
                    <input
                        type="text"
                        id="editFatherName"
                        value="${student.fatherName || ""}"
                        required
                    >

                    <label for="editDob">Date of Birth</label>
                    <input
                        type="date"
                        id="editDob"
                        value="${student.dob || ""}"
                    >

                    <label for="editGender">Gender</label>
                    <select id="editGender">

                        <option value="">Select Gender</option>

                        <option
                            value="Male"
                            ${student.gender === "Male" ? "selected" : ""}
                        >
                            Male
                        </option>

                        <option
                            value="Female"
                            ${student.gender === "Female" ? "selected" : ""}
                        >
                            Female
                        </option>

                    </select>

                    <label for="editClassName">Class</label>

                    <select id="editClassName">

                        <option value="">Select Class</option>

                        <option value="Nursery" ${student.className === "Nursery" ? "selected" : ""}>Nursery</option>
                        <option value="Prep" ${student.className === "Prep" ? "selected" : ""}>Prep</option>
                        <option value="1st" ${student.className === "1st" ? "selected" : ""}>1st</option>
                        <option value="2nd" ${student.className === "2nd" ? "selected" : ""}>2nd</option>
                        <option value="3rd" ${student.className === "3rd" ? "selected" : ""}>3rd</option>
                        <option value="4th" ${student.className === "4th" ? "selected" : ""}>4th</option>
                        <option value="5th" ${student.className === "5th" ? "selected" : ""}>5th</option>
                        <option value="6th" ${student.className === "6th" ? "selected" : ""}>6th</option>
                        <option value="7th" ${student.className === "7th" ? "selected" : ""}>7th</option>
                        <option value="8th" ${student.className === "8th" ? "selected" : ""}>8th</option>
                        <option value="9th" ${student.className === "9th" ? "selected" : ""}>9th</option>
                        <option value="10th" ${student.className === "10th" ? "selected" : ""}>10th</option>

                    </select>

                    <label for="editAdmissionDate">Admission Date</label>
                    <input
                        type="date"
                        id="editAdmissionDate"
                        value="${student.admissionDate || ""}"
                    >

                    <label for="editAddress">Address</label>

                    <textarea
                        id="editAddress"
                        rows="4"
                    >${student.address || ""}</textarea>

                    <div class="edit-actions">

                        <button type="submit">
                            Update Student
                        </button>

                        <button
                            type="button"
                            class="cancel-btn"
                            onclick="showAllStudents()"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

                <div id="updateMessage"></div>

            </div>
        `;

        document
            .getElementById("editStudentForm")
            .addEventListener("submit", updateStudent);

    } catch (error) {
        console.error(error);

        content.innerHTML = `
            <div class="error-message">
                Server connection error.
            </div>
        `;
    }
}


// ===============================
// UPDATE STUDENT
// ===============================

async function updateStudent(event) {
    event.preventDefault();

    const gmr = document.getElementById("editGmr").value.trim();

    const studentData = {
        studentName: document
            .getElementById("editStudentName")
            .value
            .trim(),

        fatherName: document
            .getElementById("editFatherName")
            .value
            .trim(),

        dob: document.getElementById("editDob").value,

        gender: document.getElementById("editGender").value,

        className: document.getElementById("editClassName").value,

        admissionDate: document
            .getElementById("editAdmissionDate")
            .value,

        address: document
            .getElementById("editAddress")
            .value
            .trim()
    };

    try {
        const response = await fetch(
            `/students/${encodeURIComponent(gmr)}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)
            }
        );

        const result = await response.json();

        const message = document.getElementById("updateMessage");

        if (response.ok) {
            message.innerHTML = `
                <div class="success-message">
                    Student updated successfully!
                </div>
            `;

            setTimeout(function () {
                showAllStudents();
            }, 700);

        } else {
            message.innerHTML = `
                <div class="error-message">
                    ${result.error || "Unable to update student."}
                </div>
            `;
        }

    } catch (error) {
        console.error(error);

        document.getElementById("updateMessage").innerHTML = `
            <div class="error-message">
                Server connection error.
            </div>
        `;
    }
}


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(gmr) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `/students/${encodeURIComponent(gmr)}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (response.ok) {
            alert("Student deleted successfully.");
            showAllStudents();
        } else {
            alert(result.error || "Unable to delete student.");
        }

    } catch (error) {
        console.error(error);
        alert("Server connection error.");
    }
}


// ===============================
// LEAVING CERTIFICATE
// ===============================

function showCertificate() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="form-container certificate-form">

            <h2>Generate Leaving Certificate</h2>

            <form id="certificateForm">

                <label for="certificateGmr">
                    GMR Number
                </label>

                <input
                    type="text"
                    id="certificateGmr"
                    placeholder="Enter GMR Number"
                    required
                >

                <button type="submit">
                    Generate Certificate
                </button>

            </form>

            <div id="certificateResult"></div>

        </div>
    `;

    document
        .getElementById("certificateForm")
        .addEventListener("submit", generateCertificate);
}


// ===============================
// GENERATE CERTIFICATE
// ===============================

async function generateCertificate(event) {
    event.preventDefault();

    const gmr = document
        .getElementById("certificateGmr")
        .value
        .trim();

    const resultBox = document.getElementById("certificateResult");

    if (!gmr) {
        resultBox.innerHTML = `
            <div class="error-message">
                Please enter GMR Number.
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(
            `/students/${encodeURIComponent(gmr)}`
        );

        const student = await response.json();

        if (!response.ok) {
            resultBox.innerHTML = `
                <div class="error-message">
                    ${student.error || "Student not found."}
                </div>
            `;
            return;
        }

        // ISSUE DATE — ISKO CHANGE NAHI KIYA
        const issueDate = new Date().toLocaleDateString("en-GB");

        resultBox.innerHTML = `

            <div class="certificate">

                <!-- TOP GOLD LINE -->
                <div class="certificate-gold-line"></div>

                <!-- DECORATIVE CORNERS -->
                <div class="corner corner-top-left"></div>
                <div class="corner corner-top-right"></div>
                <div class="corner corner-bottom-left"></div>
                <div class="corner corner-bottom-right"></div>


                <!-- HEADER -->
                <div class="certificate-header">

                    <!-- SCHOOL LOGO -->
                    <div class="school-crest">

                        <div class="crest-circle">

                            <div class="crest-inner">

                                <strong>NCS</strong>

                                <span>GOLARCHI</span>

                            </div>

                        </div>

                        <div class="crest-ribbon">
                            EST. 1990
                        </div>

                    </div>


                    <!-- SCHOOL NAME -->
                    <div class="school-heading">

                        <div class="school-small">
                            NEW CITY
                        </div>

                        <h1>
                            PUBLIC HIGH SCHOOL
                        </h1>

                        <div class="school-location">
                            GOLARCHI
                        </div>

                    </div>

                </div>


                <!-- DIVIDER -->
                <div class="gold-divider">
                    <span>✦</span>
                </div>


                <!-- CERTIFICATE TITLE -->
                <div class="certificate-title">

                    <div class="title-small">
                        OFFICIAL SCHOOL DOCUMENT
                    </div>

                    <h2>
                        SCHOOL LEAVING
                        <span>CERTIFICATE</span>
                    </h2>

                </div>


                <!-- INTRODUCTION -->
                <div class="certificate-intro">

                    <p>
                        This certificate is proudly presented to
                    </p>

                    <!-- STUDENT NAME -->
                    <h3>
                        ${student.studentName}
                    </h3>

                    <div class="name-line"></div>

                    <p class="student-description">
                        Son / Daughter of
                        <strong>${student.fatherName}</strong>
                    </p>

                </div>


                <!-- STUDENT INFORMATION -->
                <div class="certificate-details">

                    <div class="detail-box">

                        <span>GMR NUMBER</span>

                        <strong>
                            ${student.gmr}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>DATE OF BIRTH</span>

                        <strong>
                            ${student.dob || "-"}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>GENDER</span>

                        <strong>
                            ${student.gender || "-"}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>CLASS</span>

                        <strong>
                            ${student.className || "-"}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>ADMISSION DATE</span>

                        <strong>
                            ${student.admissionDate || "-"}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>ADDRESS</span>

                        <strong>
                            ${student.address || "-"}
                        </strong>

                    </div>

                </div>


                <!-- STATEMENT -->
                <div class="certificate-statement">

                    <p>
                        This is to certify that the above-mentioned student
                        has been enrolled at
                        <strong>New City Public High School, Golarchi</strong>
                        and this School Leaving Certificate is issued
                        upon completion of the required school formalities.
                    </p>

                </div>


                <!-- BOTTOM SECTION -->
                <div class="certificate-bottom">


                    <!-- ISSUE DATE -->
                    <div class="signature-box">

                        <div class="signature-line"></div>

                        <strong>
                            ${issueDate}
                        </strong>

                        <span>
                            ISSUE DATE
                        </span>

                    </div>


                    <!-- SEAL -->
                    <div class="official-seal">

                        <div class="seal-circle">

                            <strong>NCS</strong>

                            <span>
                                OFFICIAL
                            </span>

                            <small>
                                SCHOOL SEAL
                            </small>

                        </div>

                    </div>


                    <!-- PRINCIPAL -->
                    <div class="signature-box">

                        <div class="signature-line"></div>

                        <strong>
                            M.Nasir
                        </strong>

                        <span>
                            PRINCIPAL'S SIGNATURE
                        </span>

                    </div>

                </div>


                <!-- BOTTOM GOLD LINE -->
                <div class="certificate-gold-line bottom-line"></div>

            </div>


            <!-- PRINT BUTTON -->
            <div class="print-area">

                <button
                    type="button"
                    onclick="window.print()"
                >
                    Print Certificate
                </button>

            </div>

        `;

    } catch (error) {

        console.error(error);

        resultBox.innerHTML = `
            <div class="error-message">
                Server connection error.
            </div>
        `;
    }
}