import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe, logout as apiLogout } from '../services/auth.api';
import { getProfileMe } from '../../interview/services/interview.api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(null);

    const refreshProfile = useCallback(async () => {
        try {
            const data = await getProfileMe();
            setHasProfile(Boolean(data?.hasProfile));
            return Boolean(data?.hasProfile);
        } catch {
            setHasProfile(false);
            return false;
        }
    }, []);

    const logoutUser = useCallback(async () => {
        setLoading(true);
        try {
            await apiLogout();
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            try {
                localStorage.removeItem("kaushal_token");
            } catch (e) {}
            setUser(null);
            setHasProfile(null);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        // Extract Google OAuth auth_token from URL if redirected from server
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const authToken = urlParams.get("auth_token");
            if (authToken) {
                localStorage.setItem("kaushal_token", authToken);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (e) {}

        const initializeAuth = async () => {
            try {
                const data = await getMe();
                if (!isMounted) return;

                if (data?.user) {
                    setUser(data.user);
                    try {
                        const profileData = await getProfileMe();
                        if (isMounted) {
                            setHasProfile(Boolean(profileData?.hasProfile));
                        }
                    } catch {
                        if (isMounted) setHasProfile(false);
                    }
                } else {
                    setUser(null);
                    setHasProfile(null);
                }
            } catch {
                if (isMounted) {
                    setUser(null);
                    setHasProfile(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading,
            hasProfile,
            setHasProfile,
            refreshProfile,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};