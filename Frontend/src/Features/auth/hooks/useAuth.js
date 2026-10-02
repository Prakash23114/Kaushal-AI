import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { login, register, verifyOtp, resendOtp, forgotPassword, resetPassword, logout, getMe } from "../services/auth.api.js";  

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
                return { success: true, user: data.user }
            }
            throw new Error("Unable to log in.")
        } catch (err) {
            console.error("Login error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.requiresVerification) {
                return data
            }
            if (data?.user) {
                setUser(data.user)
                return { success: true, user: data.user }
            }
            return data
        } catch (err) {
            console.error("Register error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async ({ email, otp }) => {
        setLoading(true)
        try {
            const data = await verifyOtp({ email, otp })
            if (data?.user) {
                setUser(data.user)
                return { success: true, user: data.user, message: data.message }
            }
            return data
        } catch (err) {
            console.error("Verify OTP error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async ({ email }) => {
        try {
            const data = await resendOtp({ email })
            return data
        } catch (err) {
            console.error("Resend OTP error:", err)
            throw err
        }
    }

    const handleForgotPassword = async ({ email }) => {
        try {
            const data = await forgotPassword({ email })
            return data
        } catch (err) {
            console.error("Forgot password error:", err)
            throw err
        }
    }

    const handleResetPassword = async ({ email, otp, newPassword }) => {
        setLoading(true)
        try {
            const data = await resetPassword({ email, otp, newPassword })
            return data
        } catch (err) {
            console.error("Reset password error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let isMounted = true;

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (isMounted) {
                    if (data?.user) {
                        setUser(data.user)
                    } else {
                        setUser(null)
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setUser(null)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        getAndSetUser()

        return () => {
            isMounted = false;
        }
    }, [])

    return { 
        user, 
        loading, 
        handleRegister, 
        handleVerifyOtp, 
        handleResendOtp, 
        handleForgotPassword,
        handleResetPassword,
        handleLogin, 
        handleLogout 
    }
}