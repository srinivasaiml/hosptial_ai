@@ .. @@
   }
 });

+// Admin login
+router.post('/admin-login', [
+  body('username')
+    .trim()
+    .notEmpty()
+    .withMessage('Username is required'),
+  body('password')
+    .notEmpty()
+    .withMessage('Password is required')
+], async (req, res) => {
+  try {
+    // Check validation errors
+    const errors = validationResult(req);
+    if (!errors.isEmpty()) {
+      return res.status(400).json({
+        success: false,
+        message: errors.array()[0].msg
+      });
+    }
+
+    const { username, password } = req.body;
+
+    // Check for admin credentials (you can modify these or store in database)
+    const adminCredentials = {
+      username: 'admin',
+      password: 'admin123', // In production, this should be hashed
+      name: 'Hospital Administrator',
+      role: 'admin'
+    };
+
+    if (username !== adminCredentials.username || password !== adminCredentials.password) {
+      return res.status(401).json({
+        success: false,
+        message: 'Invalid admin credentials'
+      });
+    }
+
+    // Generate token
+    const token = generateToken('admin-001');
+
+    res.json({
+      success: true,
+      message: 'Admin login successful',
+      user: {
+        _id: 'admin-001',
+        name: adminCredentials.name,
+        username: adminCredentials.username,
+        role: adminCredentials.role
+      },
+      token
+    });
+
+  } catch (error) {
+    console.error('Admin login error:', error);
+    res.status(500).json({
+      success: false,
+      message: 'Admin login failed. Please try again.'
+    });
+  }
+});
+
 // Get user profile