import { createContext, useContext, useState } from 'react';
import { membershipPlans as initialPlans } from '../data/memberships';

const MembershipsContext = createContext(null);

let nextId = Math.max(...initialPlans.map(p => p.id)) + 1;

export function MembershipsProvider({ children }) {
  const [plans, setPlans] = useState(initialPlans);

  const addPlan = (data) => {
    setPlans(prev => [...prev, { ...data, id: nextId++ }]);
  };

  const updatePlan = (id, data) => {
    setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePlan = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  return (
    <MembershipsContext.Provider value={{ plans, addPlan, updatePlan, deletePlan }}>
      {children}
    </MembershipsContext.Provider>
  );
}

export function useMemberships() {
  const ctx = useContext(MembershipsContext);
  if (!ctx) throw new Error('useMemberships must be used within MembershipsProvider');
  return ctx;
}
