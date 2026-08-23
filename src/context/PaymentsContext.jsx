import { createContext, useContext, useState } from 'react';
import { payments as initialPayments } from '../data/payments';

const PaymentsContext = createContext(null);

let nextId = Math.max(...initialPayments.map(p => p.id)) + 1;

export function PaymentsProvider({ children }) {
  const [payments, setPayments] = useState(initialPayments);

  const addPayment = (data) => {
    setPayments(prev => [{ ...data, id: nextId++ }, ...prev]);
  };

  const updatePayment = (id, data) => {
    setPayments(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePayment = (id) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PaymentsContext.Provider value={{ payments, addPayment, updatePayment, deletePayment }}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error('usePayments must be used within PaymentsProvider');
  return ctx;
}
