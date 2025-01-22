import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../types'

interface AuthContextType {
    user: User | null,
    loading: boolean;
    setUser: (user: User | null) => void;
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, name: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
            setUser(JSON.parse(userJson));
        } 
    } catch (err) {
        console.error('Error checking user:', err);
    } finally {
        setLoading(false);
    }
  }
  
  const signIn = async (email: string, password: string) => {
    try {
        const usersJson = await AsyncStorage.getItem('users');
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];

        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            await AsyncStorage.setItem('user', JSON.stringify(foundUser));
            setUser(foundUser);
            return true;
        }
        return false;
    } catch (err) {
        console.error('Sign in failed:', err);
        return false;
    }
  }

  const signUp = async (email: string, name: string, password: string) => {
    try {
        const usersJson = await AsyncStorage.getItem('users');
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            return false;
        }

        const newUser: User = { email, name, password };
        users.push(newUser);

        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.setItem('user', JSON.stringify(newUser));

        setUser(newUser);
        return true;
    } catch (err) {
        console.error('Signup failed:', err);
        return false;
    }
  }

  const signOut = async () => {
    try {
        await AsyncStorage.removeItem('user');
        setUser(null);
    } catch (err) {
        console.error('Sign out failed:', err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signIn, signUp, signOut }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}