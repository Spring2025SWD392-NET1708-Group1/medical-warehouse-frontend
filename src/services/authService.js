import { decodeToken } from '../utils/decodeJWT'
export const AuthService = {
    getAuthHeaders: () => {
        const token = localStorage.getItem('token')
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    },
    handleUserNavigation: (navigate) => {
        try {
            // Get the token from localStorage (or wherever it is stored)
            const token = localStorage.getItem('token')

            if (!token) {
                throw new Error('No token found')
            } // Decode the token
            const userData = decodeToken()
            console.log(userData)

            // Check roles and navigate accordingly
            if (userData.role === 'Admin') {
                navigate('/admin')
            } else if ( userData.role === 'Staff') {
                navigate('/staff')
            } else if (userData.role === 'Manager'){
                navigate('/manager')
            }
        } catch (error) {
            console.error('Error decoding token or navigating:', error)
        }
    },
}
