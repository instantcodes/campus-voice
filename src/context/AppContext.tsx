import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Complaint {
  id: string; // Map mongo _id to id in UI
  _id?: string;
  title: string;
  category: string;
  description: string;
  location: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdBy: string;
  createdByName: string;
  createdDate: string;
  resolutionDetails?: string;
  resolvedDate?: string;
}

interface AppContextType {
  user: User | null;
  complaints: Complaint[];
  loading: boolean;
  login: (email: string, password: string, role: 'student' | 'admin') => Promise<string | null>; // Returns error msg or null on success
  register: (name: string, email: string, password: string, role: 'student' | 'admin') => Promise<string | null>;
  logout: () => void;
  addComplaint: (title: string, category: string, description: string, location: string) => Promise<boolean>;
  updateComplaint: (id: string, title: string, category: string, description: string, location: string) => Promise<boolean>;
  deleteComplaint: (id: string) => Promise<boolean>;
  updateComplaintStatus: (id: string, status: 'Pending' | 'In Progress' | 'Resolved', resolutionDetails?: string) => Promise<boolean>;
  fetchComplaints: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cv_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  // Set JWT on load if present
  useEffect(() => {
    const token = localStorage.getItem('cv_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchComplaints();
    }
  }, [user]);

  const fetchComplaints = async () => {
    const token = localStorage.getItem('cv_token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/complaints`);
      // Map MongoDB _id to id for UI consistency
      const mapped: Complaint[] = res.data.map((c: any) => ({
        ...c,
        id: c._id,
      }));
      setComplaints(mapped);
    } catch (err) {
      console.error('Error fetching complaints from MERN backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'student' | 'admin'): Promise<string | null> => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password, role });
      const { token, user: userData } = res.data;

      localStorage.setItem('cv_token', token);
      localStorage.setItem('cv_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      return null; // No error
    } catch (err: any) {
      console.error('MERN Login error:', err);
      return err.response?.data?.message || 'Login request failed. Please check backend connection.';
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'admin'): Promise<string | null> => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      const { token, user: userData } = res.data;

      localStorage.setItem('cv_token', token);
      localStorage.setItem('cv_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      return null;
    } catch (err: any) {
      console.error('MERN Registration error:', err);
      return err.response?.data?.message || 'Registration failed. Please check your inputs.';
    }
  };

  const logout = () => {
    localStorage.removeItem('cv_token');
    localStorage.removeItem('cv_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setComplaints([]);
  };

  const addComplaint = async (title: string, category: string, description: string, location: string): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/complaints`, { title, category, description, location });
      await fetchComplaints();
      return true;
    } catch (err) {
      console.error('MERN submit complaint error:', err);
      return false;
    }
  };

  const updateComplaint = async (id: string, title: string, category: string, description: string, location: string): Promise<boolean> => {
    try {
      await axios.put(`${API_URL}/complaints/${id}`, { title, category, description, location });
      await fetchComplaints();
      return true;
    } catch (err) {
      console.error('MERN update complaint error:', err);
      return false;
    }
  };

  const deleteComplaint = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/complaints/${id}`);
      await fetchComplaints();
      return true;
    } catch (err) {
      console.error('MERN delete complaint error:', err);
      return false;
    }
  };

  const updateComplaintStatus = async (id: string, status: 'Pending' | 'In Progress' | 'Resolved', resolutionDetails?: string): Promise<boolean> => {
    try {
      await axios.patch(`${API_URL}/complaints/${id}/status`, { status, resolutionDetails });
      await fetchComplaints();
      return true;
    } catch (err) {
      console.error('MERN update status error:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        complaints,
        loading,
        login,
        register,
        logout,
        addComplaint,
        updateComplaint,
        deleteComplaint,
        updateComplaintStatus,
        fetchComplaints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
