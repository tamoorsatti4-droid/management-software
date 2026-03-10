import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Trash2, CalendarDays, Banknote, Users } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', salary: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    api.get('/employees').then(res => setEmployees(res.data)).catch(console.error);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    api.post('/employees', newEmployee).then(() => {
      setNewEmployee({ name: '', role: '', salary: '' });
      fetchEmployees();
    });
  };

  const markAttendance = (empId, status) => {
    const today = new Date().toISOString().split('T')[0];
    api.post('/attendance', { employee_id: empId, date: today, status }).then(() => {
      alert(`Marked ${status} for today.`);
    });
  };

  const paySalary = (empId, salaryAmount) => {
    const month = new Date().toISOString().substring(0, 7); // YYYY-MM
    api.post('/salaries', { employee_id: empId, month, amount: salaryAmount }).then(() => {
      alert(`Salary recorded for ${month}.`);
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in animate-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Employees & Attendance</h1>
        <p className="text-slate-500 mt-2">Manage staff, record daily attendance, and process salaries.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Users className="mr-2 text-indigo-600" /> Add New Employee</h2>
        <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Full Name" required className="border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
            value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} />
          <input type="text" placeholder="Role/Designation" className="border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
            value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})} />
          <input type="number" placeholder="Monthly Salary" required className="border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
            value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})} />
          <button type="submit" className="bg-indigo-600 text-white rounded-xl font-medium p-3 flex items-center justify-center hover:bg-indigo-700 transition">
            <PlusCircle className="mr-2" /> Add Employee
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6">Staff Directory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                <th className="p-4 rounded-tl-xl">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Attendance (Today)</th>
                <th className="p-4 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="p-4 font-medium text-slate-800">{emp.name}</td>
                  <td className="p-4 text-slate-500">{emp.role}</td>
                  <td className="p-4 text-slate-800">PKR {emp.salary.toLocaleString()}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => markAttendance(emp.id, 'Present')} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200">Present</button>
                    <button onClick={() => markAttendance(emp.id, 'Absent')} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-200">Absent</button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => paySalary(emp.id, emp.salary)} className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                      <Banknote size={18} className="mr-1" /> Pay Salary
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No employees added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
