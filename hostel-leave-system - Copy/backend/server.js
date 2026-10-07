const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Leave = require("./models/Leave");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// ================= REGISTER =================
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      role,
      fullName,
      email,
      mobile,
      hostel,
      className,
      dept,
      roomNo,
      parentNo,
      password
    } = req.body;

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: "Enter Valid Number" });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain 8 characters, one uppercase, one lowercase, one number and one special character"
      });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      role,
      fullName,
      email,
      mobile,
      hostel,
      className,
      dept,
      roomNo,
      parentNo,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= LOGIN =================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Only 10 digit mobile number allowed
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(identifier)) {
      return res.status(400).json({ message: "Only valid mobile number allowed" });
    }

    const user = await User.findOne({ mobile: identifier });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: { id: user._id, role: user.role, fullName: user.fullName }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= CURRENT USER =================
app.get("/api/users/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= APPLY LEAVE =================
app.post("/api/leaves", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can apply leave" });
    }

    const { start_date, end_date, reason } = req.body;
    const today = new Date().toISOString().split("T")[0];

    if (start_date < today) return res.status(400).json({ message: "Start date cannot be in the past" });
    if (end_date < start_date) return res.status(400).json({ message: "End date cannot be before start date" });

    const student = await User.findById(req.user.id);

    const leave = new Leave({
      studentId: student._id,
      start_date,
      end_date,
      reason,
      roomNo: student.roomNo,
      parentNo: student.parentNo,
      status: "Pending ⏳"
    });

    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate("studentId", "fullName className roomNo dept");

    res.status(201).json(populatedLeave);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET LEAVES =================
app.get("/api/leaves", auth, async (req, res) => {
  try {
    let leaves = [];

    if (req.user.role === "student") {
      leaves = await Leave.find({ studentId: req.user.id })
        .populate("studentId", "fullName className roomNo dept");
    } 
    else if (req.user.role === "parent") {
      const parent = await User.findById(req.user.id);
      leaves = await Leave.find({ parentNo: parent.mobile })
        .populate("studentId", "fullName className roomNo dept");
    }
    else if (req.user.role === "hod") {
      const hod = await User.findById(req.user.id);
      const students = await User.find({ dept: hod.dept, role: "student" }).select("_id");
      const studentIds = students.map(s => s._id);
      leaves = await Leave.find({ studentId: { $in: studentIds } })
        .populate("studentId", "fullName className roomNo dept");
    }
    else if (req.user.role === "rector") {
      
      const students = await User.find({ role: "student" }).select("_id");
      const studentIds = students.map(s => s._id);
      leaves = await Leave.find({
        studentId: { $in: studentIds },
        status: { $in: ["Sent to Rector 📤", "Approved by Rector ✅"] }
      }).populate("studentId", "fullName className roomNo dept");
    }

    res.json(leaves);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= UPDATE STATUS =================
app.put("/api/leaves/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const user = await User.findById(req.user.id);

    // PARENT
    if (req.user.role === "parent" && leave.parentNo === user.mobile) {
      leave.status = status === "approve" ? "Approved by Parent ✅" : "Rejected by Parent ❌";
    }

    // HOD
    else if (req.user.role === "hod") {
      const student = await User.findById(leave.studentId);
      if (student.dept === user.dept) {
        leave.status = status === "approve" ? "Sent to Rector 📤" : "Rejected by HOD ❌";
      }
    }

    // RECTOR – All students (No hostel check)
    else if (req.user.role === "rector" && leave.status === "Sent to Rector 📤") {
      leave.status = "Approved by Rector ✅";
    }

    else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await leave.save();

    const updatedLeave = await Leave.findById(leave._id)
      .populate("studentId", "fullName className roomNo dept");

    res.json(updatedLeave);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});