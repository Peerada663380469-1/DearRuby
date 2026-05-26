import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    home: 'Home',
    dashboard: 'Dashboard',
    pos: 'POS',
    tables: 'Tables',
    orders: 'Orders',
    menu: 'Menu',
    accounting: 'Accounting',
    staff: 'Staff',
    checkout: 'Checkout',
    cancelOrder: 'Cancel Order',
    confirmOrder: 'Confirm Order',
    subtotal: 'Subtotal',
    discount: 'Discount',
    total: 'Total',
    paid: 'Paid',
    remaining: 'Remaining',
    cart: 'Cart',
    emptyCart: 'Cart is empty',
    outOfStock: 'Sold out',
    stockLeft: 'Stock:',
    add: 'Add',
    recentTransactions: 'Recent Transactions',
    revenue: 'Total Revenue',
    expenses: 'Total Expenses',
    netProfit: 'Net Profit',
    date: 'Date',
    type: 'Type',
    category: 'Category',
    details: 'Details',
    amount: 'Amount',
    noTransactions: 'No transactions in this period',
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
    tableManagment: 'Table Management',
    totalTables: 'Total tables:',
    logout: 'Logout',
    search: 'Search menu...',
    tablePrefix: 'Table',
    note: 'Note...',
    vat: 'Tax 7%',
    selectCategory: 'Category',
    allMenu: 'All Menu'
  },
  th: {
    home: 'หน้าแรก',
    dashboard: 'แดชบอร์ด',
    pos: 'จุดขาย',
    tables: 'โต๊ะ',
    orders: 'ออเดอร์',
    menu: 'เมนู',
    accounting: 'บัญชี',
    staff: 'พนักงาน',
    checkout: 'ชำระเงิน',
    cancelOrder: 'ยกเลิกออเดอร์',
    confirmOrder: 'ยืนยันออเดอร์',
    subtotal: 'ยอดรวม',
    discount: 'ส่วนลด',
    total: 'ยอดสุทธิ',
    paid: 'จ่ายแล้ว',
    remaining: 'คงเหลือ',
    cart: 'ตะกร้า',
    emptyCart: 'ตะกร้าว่างเปล่า',
    outOfStock: 'สินค้าหมด',
    stockLeft: 'เหลือ:',
    add: 'เพิ่ม',
    recentTransactions: 'ธุรกรรมล่าสุด',
    revenue: 'รายได้รวม',
    expenses: 'รายจ่ายรวม',
    netProfit: 'กำไรสุทธิ',
    date: 'วันที่',
    type: 'ประเภท',
    category: 'หมวดหมู่',
    details: 'รายละเอียด',
    amount: 'จำนวนเงิน',
    noTransactions: 'ไม่มีธุรกรรมในบีนี้',
    available: 'ว่าง',
    occupied: 'ไม่ว่าง',
    reserved: 'จองแล้ว',
    tableManagment: 'จัดการโต๊ะ',
    totalTables: 'จำนวนโต๊ะทั้งหมด:',
    logout: 'ออกจากระบบ',
    search: 'ค้นหาเมนู...',
    tablePrefix: 'โต๊ะ',
    note: 'หมายเหตุ...',
    vat: 'ภาษี 7%',
    selectCategory: 'หมวดหมู่',
    allMenu: 'เมนูทั้งหมด'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('pos_lang') || 'en');
  
  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('pos_lang', newLang);
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
