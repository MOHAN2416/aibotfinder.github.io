class UserDatabase {
    constructor() {
        // Initialize users array from localStorage
        let storedUsers = localStorage.getItem('users');
        this.users = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Add default user if users array is empty
        if (this.users.length === 0) {
            const defaultUser = {
                id: Date.now().toString(),
                email: 'mohanasurendra2416@gmail.com',
                password: 'Mohan@123',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            this.users.push(defaultUser);
            localStorage.setItem('users', JSON.stringify(this.users));
            console.log('Default user added:', defaultUser);
        }

        // Debug: Log current users
        console.log('Current users in database:', this.users);
    }

    // Debug function to check database state
    static checkDatabase() {
        const stored = localStorage.getItem('users');
        console.log('Raw localStorage data:', stored);
        console.log('Parsed users:', stored ? JSON.parse(stored) : 'No users found');
    }

    // Store new user data
    storeUser(userData) {
        try {
            // Check if user already exists
            if (this.users.some(user => user.email === userData.email)) {
                return { success: false, error: 'User already exists' };
            }

            // Create new user object
            const newUser = {
                id: Date.now().toString(),
                email: userData.email,
                password: userData.password, // In real applications, never store plain passwords
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            // Add to users array
            this.users.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(this.users));
            
            return { success: true, data: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get user by email
    getUser(email) {
        try {
            const user = this.users.find(user => user.email === email);
            if (!user) {
                return { success: false, error: 'User not found' };
            }
            return { success: true, data: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Verify user login
    verifyLogin(email, password) {
        try {
            const user = this.users.find(user => 
                user.email === email && user.password === password
            );
            
            if (!user) {
                return { success: false, error: 'Invalid credentials' };
            }

            // Update last login
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(this.users));

            return { success: true, data: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update user data
    updateUser(email, updateData) {
        try {
            const userIndex = this.users.findIndex(user => user.email === email);
            if (userIndex === -1) {
                return { success: false, error: 'User not found' };
            }

            this.users[userIndex] = { ...this.users[userIndex], ...updateData };
            localStorage.setItem('users', JSON.stringify(this.users));

            return { success: true, data: this.users[userIndex] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export database instance and add immediate debug check
export const userDB = new UserDatabase();
UserDatabase.checkDatabase();