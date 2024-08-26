import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth.context';

export const LoginPage: React.FC = () => {
    const { isAuthenticated, authenticate } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate('/admin/project');
    }, [isAuthenticated]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authenticate(username, password)
        } catch (err) {
            console.error('Authentication error:', err);
            setErrorMessage('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <img src="https://accuristech.com/wp-content/uploads/2024/07/Accuris-formerly-IHS-Left-blue.svg" alt="" style={{ height: '100px' }} />
            <h2 style={styles.heading}>Frontend Registry</h2>
            <form onSubmit={handleFormSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
                {errorMessage && <div style={styles.error}>{errorMessage}</div>}
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
    } as React.CSSProperties,
    heading: {
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    } as React.CSSProperties,
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '400px',
        height: '300px',
        padding: '40px 20px 40px 20px',
    } as React.CSSProperties,
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
        width: '100%',
    } as React.CSSProperties,
    label: {
        marginBottom: '5px',
        fontSize: '24px',
        color: '#333',
    },
    input: {
        padding: '10px',
        border: '1px solid #D0D5DD',
        borderRadius: '4px',
        height: '30px',
        fontSize: '20px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#001A4D',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        height: '50px',
        fontSize: '26px',
        '&:hover': {
            backgroundColor: '#2A6AEB',
        }
    },
    error: {
        marginTop: '10px',
        color: 'red',
    },
};