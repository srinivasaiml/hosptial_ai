@@ .. @@
 interface AuthContextType {
   user: User | null;
   token: string | null;
   login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
+  adminLogin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
   register: (name: string, username: string, mobile: string, password: string) => Promise<{ success: boolean; message: string }>;
   logout: () => void;
   isAuthenticated: boolean;
 }
@@ .. @@
     }
   };

+  const adminLogin = async (username: string, password: string) => {
+    try {
+      const response = await axios.post(`${API_BASE_URL}/auth/admin-login`, {
+        username,
+        password
+      });
+
+      if (response.data.success) {
+        const { user: userData, token: authToken } = response.data;
+        setUser(userData);
+        setToken(authToken);
+        localStorage.setItem('authToken', authToken);
+        localStorage.setItem('currentUser', JSON.stringify(userData));
+        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
+        return { success: true, message: response.data.message };
+      }
+      
+      return { success: false, message: response.data.message };
+    } catch (error: any) {
+      console.error('Admin login error:', error);
+      return { 
+        success: false, 
+        message: error.response?.data?.message || 'Admin login failed. Please try again.' 
+      };
+    }
+  };
+
   const register = async (name: string, username: string, mobile: string, password: string) => {
@@ .. @@
     <AuthContext.Provider value={{
       user,
       token,
       login,
+      adminLogin,
       register,
       logout,
       isAuthenticated: !!user && !!token
     }}>