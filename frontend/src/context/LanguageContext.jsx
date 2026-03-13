import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: "Dashboard",
    pos: "Point of Sale",
    products: "Products",
    inventory: "Inventory",
    customers: "Customers",
    suppliers: "Suppliers",
    employees: "Employees",
    expenses: "Expenses",
    reports: "Reports",
    settings: "Settings",
    ledger: "Credit Ledger",
    quickActions: "Quick Actions",
    newSale: "New Sale",
    addProduct: "Add Product",
    addCustomer: "Add Customer",
    addExpense: "Add Expense",
    totalSales: "Total Sales",
    totalPurchases: "Total Purchases",
    totalExpenses: "Total Expenses",
    salariesPaid: "Salaries Paid",
    netProfit: "Net Profit",
    pendingDues: "Pending Dues",
    aiInsights: "AI Business Analyst",
    recentActivity: "Recent Activity & Reports",
    systemOnline: "System Online",
    // General
    searchPlaceholder: "Search anything...",
    actions: "Actions",
    date: "Date",
    amount: "Amount",
    status: "Status",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    units: "units",
    action: "Action",
    
    // Sidebar Subtexts
    dashboardDesc: "Business overview",
    posDesc: "Process sales",
    ledgerDesc: "Credit records",
    productsDesc: "Item catalog",
    inventoryDesc: "Stock tracking",
    customersDesc: "Client directory",
    suppliersDesc: "Vendor list",
    employeesDesc: "Staff & payroll",
    expensesDesc: "Spending logs",
    reportsDesc: "Data analytics",
    settingsDesc: "Preferences",
    mainMenu: "Main Menu",
    management: "Management",
    
    // Employees
    staffDirectory: "Staff Directory",
    addEmployee: "Add Employee",
    totalStaff: "Total Staff",
    monthlyPayroll: "Monthly Payroll",
    role: "Role",
    salary: "Salary",
    attendance: "Attendance",
    present: "Present",
    absent: "Absent",
    halfDay: "Half Day",
    paySalary: "Pay Salary",
    
    // Reports
    analytics: "Analytics & Reports",
    period: "Period",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    profitSummary: "Performance Summary",
    revenue: "Revenue",
    cost: "Cost",
    exportExcel: "Export Excel",
    printPDF: "Print PDF",
    
    // Inventory & Products
    stockStatus: "Stock Status",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    buyingPrice: "Buying Price",
    sellingPrice: "Selling Price",
    category: "Category",
    serialNumber: "Serial Number",
    product: "Product",
    
    // Customers & Suppliers
    phone: "Phone",
    email: "Email",
    address: "Address",
    creditLimit: "Credit Limit",
    balance: "Balance",
    
    // Settings & Appearance
    businessName: "Business Name",
    currency: "Currency",
    taxRate: "Tax Rate",
    appearance: "Appearance",
    profile: "Profile",
    interfaceTheme: "Interface Theme",
    themeDesc: "Choose dashboard appearance",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    sidebarPrefs: "Sidebar Preferences",
    expandSidebar: "Expand sidebar by default",
    profileDesc: "Personal info",
    security: "Security",
    securityDesc: "Passwords & Roles",
    notifications: "Notifications",
    notificationsDesc: "Alerts & Emails",
    help: "Help",
    helpDesc: "Support & Docs",
    
    switchUrdu: "اردو",
    switchEnglish: "English",
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    pos: "پوائنٹ آف سیل",
    products: "پروڈکٹس",
    inventory: "انوینٹری",
    customers: "کسٹمرز",
    suppliers: "سپلائرز",
    employees: "ملازمین",
    expenses: "اخراجات",
    reports: "رپورٹس",
    settings: "سیٹنگز",
    ledger: "ادھار کھاتہ",
    quickActions: "فوری ایکشنز",
    newSale: "نئی فروخت",
    addProduct: "پروڈکٹ شامل کریں",
    addCustomer: "کسٹمر شامل کریں",
    addExpense: "خرچہ شامل کریں",
    totalSales: "کل فروخت",
    totalPurchases: "کل خریداری",
    totalExpenses: "کل اخراجات",
    salariesPaid: "ادا شدہ تنخواہیں",
    netProfit: "خالص منافع",
    pendingDues: "کل بقایا جات",
    aiInsights: "اے آئی بزنس تجزیہ کار",
    recentActivity: "حالیہ سرگرمی اور رپورٹس",
    systemOnline: "سستم آن لائن",
    
    // General
    searchPlaceholder: "تلاش کریں...",
    actions: "ایکشنز",
    date: "تاریخ",
    amount: "رقم",
    status: "سٹیٹس",
    save: "محفوظ کریں",
    cancel: "کینسل",
    delete: "حذف کریں",
    edit: "تبدیل کریں",
    units: "یونٹس",
    action: "ایکشن",

    // Sidebar Subtexts
    dashboardDesc: "کاروبار کا خلاصہ",
    posDesc: "ٹرانزیکشنز کریں",
    ledgerDesc: "کریڈٹ ریکارڈز",
    productsDesc: "آئٹم لسٹ",
    inventoryDesc: "اسٹاک ٹریکنگ",
    customersDesc: "کلائنٹ ڈائرکٹری",
    suppliersDesc: "سپلائر لسٹ",
    employeesDesc: "عملہ اور تنخواہ",
    expensesDesc: "اخراجات کا ریکارڈ",
    reportsDesc: "ڈیٹا تجزیہ",
    settingsDesc: "ترجیحات",
    mainMenu: "مین مینو",
    management: "مینجمنٹ",

    // Employees
    staffDirectory: "ملازمین کی فہرست",
    addEmployee: "ملازم شامل کریں",
    totalStaff: "کل عملہ",
    monthlyPayroll: "ماہانہ تنخواہیں",
    role: "عہدہ",
    salary: "تنخواہ",
    attendance: "حاضری",
    present: "حاضر",
    absent: "غیر حاضر",
    halfDay: "آدھی چھٹی",
    paySalary: "تنخواہ دیں",

    // Reports
    analytics: "تجزیہ اور رپورٹس",
    period: "دورانیہ",
    daily: "روزانہ",
    weekly: "ہفتہ وار",
    monthly: "ماہانہ",
    yearly: "سالانہ",
    profitSummary: "کارکردگی کا خلاصہ",
    revenue: "آمدنی",
    cost: "لاگت",
    exportExcel: "ایکسل ایکسپورٹ",
    printPDF: "پی ڈی ایف پرنٹ",

    // Inventory & Products
    stockStatus: "اسٹاک کی صورتحال",
    inStock: "اسٹاک میں ہے",
    outOfStock: "اسٹاک ختم",
    buyingPrice: "قیمت خرید",
    sellingPrice: "قیمت فروخت",
    category: "کیٹیگری",
    serialNumber: "سیریل نمبر",
    product: "پروڈکٹ",

    // Customers & Suppliers
    phone: "فون",
    email: "ای میل",
    address: "پتہ",
    creditLimit: "ادھار کی حد",
    balance: "بقایا",

    // Settings & Appearance
    businessName: "کاروبار کا نام",
    currency: "کرنسی",
    taxRate: "ٹیکس کی شرح",
    appearance: "ظاہری شکل",
    profile: "پروفائل",
    interfaceTheme: "انٹرفیس تھیم",
    themeDesc: "ڈیش بورڈ تھیم منتخب کریں",
    lightMode: "لائٹ موڈ",
    darkMode: "ڈارک موڈ",
    sidebarPrefs: "سائیڈ بار سیٹنگز",
    expandSidebar: "سائیڈ بار ہمیشہ کھلا رکھیں",
    profileDesc: "ذاتی معلومات",
    security: "سیکیورٹی",
    securityDesc: "پاس ورڈ اور عہدہ",
    notifications: "نوٹیفکیشنز",
    notificationsDesc: "الرٹس اور ای میلز",
    help: "مدد",
    helpDesc: "سپورٹ اور معلومات",

    switchUrdu: "اردو",
    switchEnglish: "English",
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  const dir = lang === 'ur' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('lang', lang);
  }, [lang, dir]);

  const t = (key) => translations[lang][key] || key;

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ur' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLanguage }}>
      <div style={{ direction: dir }} className={lang === 'ur' ? 'font-urdu' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
