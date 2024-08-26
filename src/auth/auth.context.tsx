import { createContext, useContext, useEffect, useState } from 'react';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: any) => {
    const poolData = {
        UserPoolId: process.env.PUBLIC_USER_POOL_ID!,
        ClientId: process.env.PUBLIC_COGNITO_CLIENT_ID!,
    };

    const userpool = new CognitoUserPool(poolData);

    const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('isAuthenticated') === 'true');
    const [idToken, setIdToken] = useState(() => sessionStorage.getItem('idToken') || '');

    useEffect(() => {
        sessionStorage.setItem('isAuthenticated', isAuthenticated.toString());
    }, [isAuthenticated]);

    useEffect(() => {
        sessionStorage.setItem('idToken', idToken);
    }, [idToken]);

    const authenticate = (Email: string, Password: string) => {
        console.log('Authenticating with', Email, Password);
        return new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username: Email,
                Pool: userpool
            });
            const authDetails = new AuthenticationDetails({
                Username: Email,
                Password
            });
            user.authenticateUser(authDetails, {
                onSuccess: (result) => {
                    console.log("login successful");
                    setIsAuthenticated(true);
                    setIdToken(result.getIdToken().getJwtToken());
                    resolve(result);
                },
                onFailure: (err) => {
                    console.log("login failed", err);
                    reject(err);
                }
            });
        });
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIdToken('');
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            authenticate,
            idToken,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
