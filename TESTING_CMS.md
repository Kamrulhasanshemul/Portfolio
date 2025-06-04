# CMS Update Testing Guide

This guide will help you test that the Content Management System (CMS) is working correctly and changes are reflecting immediately on the live site.

## Prerequisites

1. **Start the Preview Server:**
   ```bash
   npm run preview
   ```
   The server will start on an available port (usually 4173, 4174, 4175, or 4176).

2. **Note the Port:** Check the terminal output to see which port is being used.

## Testing Steps

### 1. Test Basic Functionality

1. **Open Two Browser Tabs/Windows:**
   - Tab 1: Main portfolio site: `http://localhost:XXXX/` (replace XXXX with your port)
   - Tab 2: Admin panel: `http://localhost:XXXX/admin`

2. **Login to Admin Panel:**
   - Username: `admin`
   - Password: `admin123`

### 2. Test Immediate Updates

**Test Hero Section Updates:**

1. In the admin panel, go to the "Hero Section" 
2. Change the title from "Data Analyst" to "Senior Data Analyst"
3. Click "💾 Save Changes*" button
4. You should see:
   - Button changes to "⏳ Saving..."
   - Then shows "✅ Saved"
   - Green success message appears
   - "Last saved" timestamp updates

5. **Switch to the main portfolio tab**
6. The title should update immediately to "Senior Data Analyst"

**Test Stats Updates:**

1. In admin panel, change "Years Experience" from 5 to 7
2. Save changes
3. Check main portfolio - the stats should update immediately

**Test About Section:**

1. Change the description or add/remove technical expertise items
2. Save changes
3. Verify updates appear on main site immediately

### 3. Advanced Testing

**Test Multiple Updates:**

1. Make changes to multiple sections (Hero + Stats + Services)
2. Save once
3. All changes should reflect immediately

**Test Page Refresh Sync:**

1. Make changes in admin and save
2. Refresh the main portfolio page
3. Changes should persist

**Test Window Focus Sync:**

1. Make changes in admin (don't save yet)
2. Switch to main portfolio tab 
3. Make changes in admin and save
4. Switch back to main portfolio tab
5. Changes should appear when you focus the window

## Expected Behavior

### ✅ What Should Work:

- **Immediate Updates:** Changes appear on the main site immediately after saving
- **Visual Feedback:** Clear success/error messages in admin panel
- **Save State Tracking:** Button shows current save state
- **Change Detection:** "Unsaved changes" warning appears when editing
- **Auto-refresh:** Main site refreshes content when window gains focus
- **Persistence:** Changes survive page refreshes
- **All Sections:** Hero, Stats, About, Services, Projects, Skills, Experience, Contact all update properly

### ❌ Common Issues (Now Fixed):

- ~~Changes not appearing immediately~~
- ~~Need to manually refresh to see updates~~
- ~~Save button not responding~~
- ~~No feedback when saving~~

## Console Debugging

Open browser DevTools (F12) and check the Console tab for helpful debug messages:

### Admin Panel Console Messages:
```
Admin received content update: {object}
Admin: Content changed, marking as dirty
Admin: Saving content... {object}
Admin: Content saved successfully
```

### Main Portfolio Console Messages:
```
Content store already initialized
Landing page received content update: {object}
Window focused, refreshing content...
Content store updated successfully
```

## Troubleshooting

### If Changes Don't Appear:

1. **Check Browser Console** for error messages
2. **Verify Save Button** shows "✅ Saved" 
3. **Check Network Tab** in DevTools for API calls
4. **Try the Refresh Button** (🔄) in admin panel
5. **Focus the main portfolio window** to trigger auto-refresh

### If Save Button Doesn't Work:

1. Check that you've made actual changes (button is disabled when no changes)
2. Look for error messages in the admin panel
3. Check browser console for JavaScript errors

### Test with Node.js Script:

Run the test script to verify API functionality:
```bash
node test-update.js
```

This will test the API endpoints independently.

## What's New

### Enhanced Features:
- **Real-time Sync:** Changes appear immediately without manual refresh
- **Better Feedback:** Clear visual indicators for save status
- **Smart Refresh:** Automatic content refresh when switching between tabs
- **Debug Logging:** Console messages help track what's happening
- **Error Handling:** Better error messages and recovery
- **Change Tracking:** Visual indicators for unsaved changes

### Technical Improvements:
- Enhanced content store with refresh capability
- Improved admin panel reactivity
- Better subscription management
- Automatic content synchronization
- Page visibility and focus event handling

## Success Criteria

✅ **Full Success:** You can edit any section in the admin panel, click save, and immediately see the changes on the main portfolio site without any manual refresh.

If you encounter any issues following this guide, check the console for error messages or create an issue with the specific steps that didn't work as expected. 