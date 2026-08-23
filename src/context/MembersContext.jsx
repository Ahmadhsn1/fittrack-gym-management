import { createContext, useContext, useState } from 'react';
import { members as initialMembers } from '../data/members';

const MembersContext = createContext(null);

let nextId = Math.max(...initialMembers.map(m => m.id)) + 1;

export function MembersProvider({ children }) {
  const [members, setMembers] = useState(initialMembers);

  const addMember = (data) => {
    setMembers(prev => [{ ...data, id: nextId++ }, ...prev]);
  };

  const updateMember = (id, data) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <MembersContext.Provider value={{ members, addMember, updateMember, deleteMember }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error('useMembers must be used within MembersProvider');
  return ctx;
}
