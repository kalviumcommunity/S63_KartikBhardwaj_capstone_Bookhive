# 🔧 Bruno Setup & Environment Fix Guide

## 🚨 **Environment Not Showing? Follow This!**

### **Step 1: Close Bruno App Completely**
1. Quit Bruno application completely
2. Wait 5 seconds
3. Reopen Bruno

### **Step 2: Import Collection (CORRECT METHOD)**
```
1. Open Bruno App
2. Click "Open Collection" or File → Open Collection
3. Navigate to your project folder
4. Select the ENTIRE `/bruno` folder (NOT just environments!)
5. Click "Open"
```

### **Step 3: Verify Environment Detection**
After import, you should see:
- Collection name: "BookHive API Collection" 
- Environment dropdown (top-left) should show:
  - 🌍 Local
  - 🌍 Production

### **Step 4: If Still Not Working - Manual Refresh**
```
Method 1: Refresh Collection
1. Right-click on collection name
2. Select "Refresh Collection"
3. Check environment dropdown

Method 2: Re-import
1. File → Close Collection
2. File → Open Collection
3. Select `/bruno` folder again

Method 3: Clear Bruno Cache
1. Close Bruno
2. Delete Bruno cache folder:
   - Mac: ~/Library/Application Support/Bruno
   - Windows: %APPDATA%/Bruno
   - Linux: ~/.config/Bruno
3. Restart Bruno
4. Import collection again
```

## 📂 **Correct Collection Structure**

```
bruno/                          ← Import THIS folder
├── bruno.json                  ← Collection metadata (REQUIRED)
├── environments/               ← Environment folder
│   ├── Local.bru              ← Local environment (with meta block)
│   └── Production.bru         ← Production environment (with meta block)
├── Auth/                      ← Request folders
│   ├── 01-User-Signup.bru
│   ├── 02-User-Login.bru
│   └── ...
└── Books/
    ├── 01-Get-All-Books.bru
    └── ...
```

## ✅ **Environment File Format (CORRECT)**

### Local.bru:
```yaml
meta {
  name: Local
  type: environment
}

vars {
  baseUrl: http://localhost:3000/api
  token: 
  userId: 
}
```

### Production.bru:
```yaml
meta {
  name: Production
  type: environment
}

vars {
  baseUrl: https://your-api.onrender.com/api
  token: 
  userId: 
}
```

## 🚫 **Common Mistakes to Avoid**

❌ **Wrong Import Methods:**
- Importing only `environments/` folder
- Importing individual `.bru` files
- Missing `bruno.json` file

❌ **Wrong Environment Format:**
- Missing `meta` block
- Wrong `type` value
- Incorrect YAML syntax

❌ **File Naming Issues:**
- Hidden file extensions (.txt)
- Special characters in names
- Spaces in environment names

## 🔄 **Environment Switching Workflow**

### **After Successful Import:**
1. Select environment from dropdown (top-left)
2. Run Auth requests first to populate tokens
3. All subsequent requests use selected environment variables

### **Variable Auto-Population:**
```javascript
// These variables auto-populate after running requests:
token: (from login/signup responses)
userId: (from auth responses)  
bookId: (from search responses)
```

## 🛠️ **Troubleshooting Checklist**

### **If Environment Still Not Showing:**

1. ✅ **Check Files Exist:**
   ```bash
   ls -la bruno/environments/
   # Should show: Local.bru, Production.bru
   ```

2. ✅ **Verify File Format:**
   - Both files have `meta` blocks
   - Correct YAML syntax
   - No hidden characters

3. ✅ **Check Collection Root:**
   - `bruno.json` exists in root
   - Collection name matches

4. ✅ **Bruno App Version:**
   - Update to latest version
   - Restart after update

5. ✅ **File Permissions:**
   ```bash
   # Make files readable
   chmod 644 bruno/environments/*.bru
   chmod 644 bruno/bruno.json
   ```

## 📋 **Step-by-Step Verification**

### **Test 1: File Structure**
```bash
find bruno/ -name "*.bru" -o -name "*.json"
# Should list all .bru and .json files
```

### **Test 2: Environment Format**
```bash
head -5 bruno/environments/Local.bru
# Should show meta block at top
```

### **Test 3: Import Success**
- Environment dropdown shows options
- Collection shows in Bruno sidebar
- Requests are organized in folders

## 🎯 **Success Indicators**

✅ **Environment Working When:**
- Dropdown shows "Local" and "Production"
- Variables populate in requests
- Token management works automatically
- Base URL changes between environments

---

**🔧 If still having issues:** Close Bruno → Clear cache → Restart → Re-import entire `/bruno` folder