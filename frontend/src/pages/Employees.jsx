import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Banknote, Users, CheckCircle, XCircle, Clock, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Employees() {
  const { t, lang, dir } = useLanguage();
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', salary: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    api.get('/employees').then(res => setEmployees(res.data)).catch(() => {
      setEmployees([
        { id: 1, name: 'Ahmad Khan', role: 'Manager', salary: 55000 },
        { id: 2, name: 'Bilal Hussain', role: 'Sales Associate', salary: 35000 },
        { id: 3, name: 'Faisal Ahmed', role: 'Warehouse', salary: 28000 },
        { id: 4, name: 'Usman Ali', role: 'Driver', salary: 25000 },
        { id: 5, name: 'Kamran Raza', role: 'Accountant', salary: 45000 },
      ]);
    });
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
    }).catch(() => alert(`Marked ${status} (demo mode).`));
  };

  const paySalary = (empId, salaryAmount) => {
    const month = new Date().toISOString().substring(0, 7);
    api.post('/salaries', { employee_id: empId, month, amount: salaryAmount }).then(() => {
      alert(`Salary recorded for ${month}.`);
    }).catch(() => alert(`Salary recorded (demo mode).`));
  };

  const totalSalaries = employees.reduce((sum, e) => sum + (e.salary || 0), 0);

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
              <Users size={22} />
            </div>
            {t('employees')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage staff, record attendance, and process salaries.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-center">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('totalStaff')}</div>
            <div className="text-xl font-black text-slate-800 dark:text-white">{employees.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-center">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('monthlyPayroll')}</div>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">PKR {totalSalaries.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Add Employee Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold mb-4 flex items-center text-slate-800 dark:text-white">
          <PlusCircle className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-blue-500`} size={20} /> {t('addEmployee')}
        </h2>
        <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input type="text" placeholder="Full Name" required
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} />
          <input type="text" placeholder="Role / Designation"
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})} />
          <input type="number" placeholder="Monthly Salary (PKR)" required
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})} />
          <button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium p-3 text-sm flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30 transition">
            <PlusCircle className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} size={16} /> {t('save')}
          </button>
        </form>
      </div>

      {/* Staff Directory */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          <Briefcase size={20} className="text-slate-400" /> {t('staffDirectory')}
        </h2>
        <div className="overflow-x-auto">
          <table className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'} border-collapse`}>
            <thead>
              <tr className="border-b-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">
                <th className="p-4">{t('employees')}</th>
                <th className="p-4">{t('role')}</th>
                <th className="p-4">{t('salary')}</th>
                <th className="p-4">{t('attendance')} (Today)</th>
                <th className="p-4">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-white text-sm">{emp.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">{emp.role}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800 dark:text-white">PKR {emp.salary?.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => markAttendance(emp.id, 'Present')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle size={12} /> {t('present')}
                      </button>
                      <button onClick={() => markAttendance(emp.id, 'Absent')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-lg text-[10px] font-semibold hover:bg-rose-100 dark:hover:bg-rose-950/50 transition border border-rose-200 dark:border-rose-800">
                        <XCircle size={12} /> {t('absent')}
                      </button>
                      <button onClick={() => markAttendance(emp.id, 'Half Day')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-lg text-[10px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/50 transition border border-amber-200 dark:border-amber-800">
                        <Clock size={12} /> {t('halfDay')}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <button onClick={() => paySalary(emp.id, emp.salary)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg transition border border-indigo-200 dark:border-indigo-800">
                      <Banknote size={14} /> {t('paySalary')}
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No employees added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
