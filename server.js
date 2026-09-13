const express = require("express");
const Database = require("better-sqlite3");

const app = express();

app.use(express.json());
app.use(express.static("."));

const PORT = 3000;


// ========================================
// DATABASE
// ========================================

const db = new Database("school.db");

console.log("Database connected successfully!");


// ========================================
// CREATE STUDENTS TABLE
// ========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gmr TEXT UNIQUE NOT NULL,
        studentName TEXT NOT NULL,
        fatherName TEXT NOT NULL,
        dob TEXT,
        gender TEXT,
        className TEXT,
        admissionDate TEXT,
        address TEXT
    )
`).run();


// ========================================
// SAVE STUDENT
// ========================================

app.post("/students", (req, res) => {

    const {
        gmr,
        studentName,
        fatherName,
        dob,
        gender,
        className,
        admissionDate,
        address
    } = req.body;

    try {

        const statement = db.prepare(`
            INSERT INTO students
            (
                gmr,
                studentName,
                fatherName,
                dob,
                gender,
                className,
                admissionDate,
                address
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        statement.run(
            gmr,
            studentName,
            fatherName,
            dob,
            gender,
            className,
            admissionDate,
            address
        );

        res.json({
            success: true,
            message: "Student saved successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            error: "GMR Number already exists or data is invalid."
        });
    }
});


// ========================================
// GET ALL STUDENTS
// ========================================

app.get("/students", (req, res) => {

    try {

        const students = db.prepare(`
            SELECT * FROM students
            ORDER BY id DESC
        `).all();

        // Direct array send
        res.json(students);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to get students."
        });
    }
});


// ========================================
// SEARCH STUDENT BY GMR
// ========================================

app.get("/students/:gmr", (req, res) => {

    const gmr = req.params.gmr;

    try {

        const student = db.prepare(`
            SELECT * FROM students
            WHERE gmr = ?
        `).get(gmr);

        if (!student) {

            return res.status(404).json({
                error: "Student not found."
            });
        }

        // Direct student data send
        res.json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to search student."
        });
    }
});


// ========================================
// UPDATE STUDENT
// ========================================

app.put("/students/:gmr", (req, res) => {

    const oldGmr = req.params.gmr;

    const {
        studentName,
        fatherName,
        dob,
        gender,
        className,
        admissionDate,
        address
    } = req.body;

    try {

        const result = db.prepare(`
            UPDATE students
            SET
                studentName = ?,
                fatherName = ?,
                dob = ?,
                gender = ?,
                className = ?,
                admissionDate = ?,
                address = ?
            WHERE gmr = ?
        `).run(
            studentName,
            fatherName,
            dob,
            gender,
            className,
            admissionDate,
            address,
            oldGmr
        );

        if (result.changes === 0) {

            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            error: "Unable to update student."
        });
    }
});


// ========================================
// DELETE STUDENT
// ========================================

app.delete("/students/:gmr", (req, res) => {

    const gmr = req.params.gmr;

    try {

        const result = db.prepare(`
            DELETE FROM students
            WHERE gmr = ?
        `).run(gmr);

        if (result.changes === 0) {

            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to delete student."
        });
    }
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});