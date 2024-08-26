import { useAuth } from '../auth/auth.context';
import { ListProject } from '../project/listProject.component';

export const AdminPage = () => {
    const { logout } = useAuth();

    return (
        <div>
            <nav style={styles.nav}>
                <div style={styles.navContent}>
                    <img src="https://accuristech.com/wp-content/uploads/2024/07/Accuris-formerly-IHS-Left-blue.svg" alt="" style={{ height: '50%' }} />
                    <button style={styles.button} onClick={logout}>
                        Logout
                    </button>
                </div>
            </nav>
            <main style={styles.main}>
                <ListProject />
            </main>
        </div>
    );
};

const styles = {
    navContent: {
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        height: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
    },
    nav: {
        height: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        height: '20px',
        cursor: 'pointer',
        border: 'none',
    },
    main: {
        maxWidth: '800px',
        margin: '0 auto',
    },
};
