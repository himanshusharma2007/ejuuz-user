import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // This is important for sending/receiving cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

class AuthService {
    async sendOtp(phoneNumber) {
        try {
            const response = await api.post('/api/auth/send-otp', { phoneNumber });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async verifyOtp(otp) {
        try {
            const response = await api.post('/api/auth/verify-otp', { otp });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getCurrentUser() {
        try {
            const response = await api.get('/api/auth/me');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async logout() {
        try {
            // Clear cookies by making them expire
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            return { success: true };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            // Server responded with error
            return {
                status: error.response.status,
                message: error.response.data.error || 'An error occurred',
                details: error.response.data.details
            };
        }
        // Network error or other issues
        return {
            status: 500,
            message: 'Network error or server is not responding',
            details: error.message
        };
    }
}

export default new AuthService();
