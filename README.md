# Human Resource Management System (HRMS)

**Every workday, perfectly aligned.**

Dayflow is a full-stack, web-based Human Resource Management System built to digitize and streamline essential HR operations such as employee onboarding, attendance tracking, leave management, payroll visibility, and approval workflows.

This project solves the given problem statement using the **MERN Stack (with Vite + React)** to deliver a secure, scalable, and user-friendly HRMS platform.

---

## 📌 Problem Statement

Organizations often rely on manual or fragmented systems for managing employees, attendance, and payroll, which leads to inefficiency, lack of transparency, and errors.

The objective of Dayflow is to build a centralized HRMS that:

* Digitizes HR operations
* Provides role-based access for Admin/HR and Employees
* Ensures secure authentication and data handling
* Simplifies attendance, leave, and payroll management

---

## 🎯 Purpose

The purpose of this system is to define and implement both functional and non-functional requirements of an HRMS that:

* Improves operational efficiency
* Reduces manual work
* Ensures accuracy, security, and scalability
* Enhances employee experience

---

## 📦 Scope of the System

Dayflow provides:

* Secure authentication (Sign Up / Sign In)
* Role-based access control (Admin / HR vs Employee)
* Employee profile management
* Attendance tracking (daily and weekly)
* Leave and time-off management
* Approval workflows for Admin/HR
* Payroll visibility

---

## 📖 Definitions & Abbreviations

* **Admin / HR Officer**: User with management and approval privileges
* **Employee**: Regular user with limited access
* **Time-Off**: Paid leave, sick leave, unpaid leave, etc.

---

## 👥 User Classes and Characteristics

| User Type              | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| **Admin / HR Officer** | Manages employees, approves leave and attendance, views and updates payroll |
| **Employee**           | Views personal profile, attendance, applies for leave, views salary         |

---

## ⚙️ Functional Requirements

### 1. Authentication & Authorization

#### Sign Up

* Users register using:

  * Employee ID
  * Email
  * Password
  * Role (Employee / HR)
* Password follows security rules
* Email verification is required

#### Sign In

* Login with email and password
* Error messages for invalid credentials
* Successful login redirects to the dashboard

---

## 🛠️ Solution Overview (MERN Stack)

The system is implemented using a **MERN stack architecture**, with **Vite + React** used for fast, optimized frontend development. The architecture ensures separation of concerns, scalability, and secure data handling.

### Tech Stack Used

* **Frontend**: **Vite + React.js**
* **Backend**: Node.js + Express.js
* **Database**: MongoDB
* **Authentication**: JWT (JSON Web Tokens)
* **API Style**: RESTful APIs

---

## 🚀 Future Enhancements

* Email and push notification alerts
* Analytics & reporting dashboard
* Attendance and payroll reports
* Salary slip generation (PDF)
* Export reports to Excel / PDF

---

## ✅ Conclusion

Dayflow effectively addresses the HRMS problem statement by providing a centralized, secure, and scalable solution. The use of **Vite + React** enables faster development and improved performance, while the MERN stack ensures maintainability and seamless integration across the system.

---

**Built using MERN Stack with Vite + React for modern, scalable HR solutions**
