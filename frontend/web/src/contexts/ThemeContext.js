import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const lightTheme = {
    // Light mode: white surface and red accents only
    '--bg-gradient-start': '#ffffff',
    '--bg-gradient-end': '#ffffff',
    '--primary': '#B00020',
    '--primary-700': '#8A0018',
    '--text': '#000000',
    '--surface': '#ffffff',
};

const darkTheme = {
    '--bg-gradient-start': '#000000',
    '--bg-gradient-end': '#000000',
    '--primary': '#B00020',
    '--primary-700': '#8A0018',
    '--text': '#ffffff',
    '--surface': '#000000',
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') setTheme(saved);
    }, []);

    useEffect(() => {
        const vars = theme === 'dark' ? darkTheme : lightTheme;
        Object.entries(vars).forEach(([k, v]) => {
            document.documentElement.style.setProperty(k, v);
        });
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
