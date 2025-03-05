export const signupService = {
  register: async (userData) => {
    const response = await fetch('http://localhost:5090/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('Failed to register')
    }
    return response.json()
  },
}
