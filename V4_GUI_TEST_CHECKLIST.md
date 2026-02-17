# 🧪 CTRBooster V4 - GUI Test Checklist

## Pre-Test Setup
1. Open `ctrb_web_editor_v4.html` in browser
2. Load test data: Go to "Import/Export" tab → Load `testtemp.json` or `ctrb_v4_test_data.json`

---

## ✅ V4 Feature Tests

### 1. Template Library (NEW!)

**Test Steps:**
- [ ] Click "📋 Templates" tab
- [ ] Verify 5 default templates visible:
  - 🗺️ GMap Local Business
  - 🔍 GSearch Brand
  - 🔗 RefDVisit Social
  - 🎯 Direct Visit
  - 🔬 GSearchRef Combo
- [ ] Click "GMap Local Business" template
- [ ] **Expected:** New campaign created + edit modal opens
- [ ] Verify campaign has GMap settings pre-filled

**Create Template from Campaign:**
- [ ] Go to Templates tab
- [ ] Select a campaign from dropdown
- [ ] Enter template name: "My Test Template"
- [ ] Enter description: "Test description"
- [ ] Click "Create Template"
- [ ] **Expected:** Alert confirms creation, template appears in grid

---

### 2. Validation Warnings (NEW!)

**Test Steps:**
- [ ] Edit any campaign (click ✏️)
- [ ] Clear the "Project Name" field (make it empty)
- [ ] Click "💾 Save Changes"
- [ ] **Expected:** Red validation panel appears with "Project Name is required"
- [ ] Click "Cancel"

**Test Time Format Validation:**
- [ ] Edit a campaign
- [ ] Go to "📋 Basic" tab
- [ ] Change Start Time to "invalid format"
- [ ] Click Save
- [ ] **Expected:** Warning about time format should appear

**Test Geo Validation:**
- [ ] Edit a campaign
- [ ] Go to "📍 Geolocation" tab
- [ ] Check "Use Geolocation"
- [ ] Clear all geolocation points
- [ ] Click Save
- [ ] **Expected:** Warning about missing geolocations

**Test Daily Limit > Total:**
- [ ] Edit a campaign
- [ ] Set Total Visits = 100
- [ ] Set Daily Limit = 500
- [ ] Click Save
- [ ] **Expected:** Warning about Daily Limit > Total Visits

**Save Anyway:**
- [ ] Trigger a validation warning
- [ ] Click "Save Anyway" button
- [ ] **Expected:** Campaign saves despite warnings

---

### 3. Campaign Comparison (NEW!)

**Test Steps:**
- [ ] Go to Campaign List tab
- [ ] Select 2-3 campaigns (checkboxes)
- [ ] Click "📊 Compare" button in bulk toolbar
- [ ] **Expected:** Modal opens with side-by-side comparison
- [ ] Verify differing fields are highlighted in orange
- [ ] Verify matching fields have normal background
- [ ] Click "Close"

**Edge Case:**
- [ ] Select only 1 campaign
- [ ] Click Compare
- [ ] **Expected:** Alert "Select 2-3 campaigns to compare"

- [ ] Select 4+ campaigns
- [ ] Click Compare
- [ ] **Expected:** Alert "Select 2-3 campaigns to compare"

---

### 4. Bulk Edit (Fixed!)

**Test Steps:**
- [ ] Select 3+ campaigns (checkboxes)
- [ ] Bulk toolbar should appear
- [ ] Click "Bulk Edit" button
- [ ] **Expected:** Modal opens with bulk edit form
- [ ] Fill in "Daily Limit" = 10
- [ ] Fill in "Total Visits" = 500
- [ ] Select "Device Type" = Mobile
- [ ] Click "Apply to X Campaigns"
- [ ] **Expected:** Modal closes, campaigns updated
- [ ] Edit one of the campaigns to verify changes applied

---

### 5. Export Selected (Fixed!)

**Test Steps:**
- [ ] Select 2-3 campaigns (checkboxes)
- [ ] Bulk toolbar appears
- [ ] Click "Export Selected" button
- [ ] **Expected:** JSON file downloads: `ctr_selected_X_campaigns.json`
- [ ] Open downloaded file
- [ ] **Expected:** Contains only selected campaigns (not all)

---

## ✅ V3 Features (Regression Test)

### Campaign List
- [ ] Campaigns display in table
- [ ] Search by name/ID works
- [ ] Type filter dropdown works
- [ ] Checkbox select/deselect works
- [ ] Select all checkbox works

### Edit Campaign Modal
- [ ] All 6 tabs visible (Basic, Timing, Targets, Geo, Device, Advanced)
- [ ] Can edit fields in each tab
- [ ] Save changes works
- [ ] Cancel works
- [ ] Geo point counter updates live
- [ ] Mobile % toggle works when DeviceType = Mix

### Client Wizard
- [ ] Fill in wizard form
- [ ] Click "🚀 Generate Campaigns"
- [ ] **Expected:** Multiple campaigns created
- [ ] Verify campaigns appear in list

### Import/Export
- [ ] Load JSON file works
- [ ] Merge vs Replace mode works
- [ ] Download JSON works
- [ ] Parse textarea works

### Clone Campaign
- [ ] Click 📋 (clone) button on a campaign
- [ ] **Expected:** Duplicate created with "(Copy)" in name

### Delete Campaign
- [ ] Click ✕ (delete) button
- [ ] **Expected:** Confirmation dialog
- [ ] Confirm → Campaign removed

### Bulk Delete
- [ ] Select multiple campaigns
- [ ] Click "Delete" in bulk toolbar
- [ ] **Expected:** Confirmation with count
- [ ] Confirm → All selected removed

---

## 🐛 Bug Reporting

If you find issues, note:
1. Feature being tested
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Browser + version
6. Screenshot (if helpful)

---

## ✅ Sign-Off

When all tests pass:
- [ ] Templates: Working
- [ ] Validation: Working
- [ ] Compare: Working
- [ ] Bulk Edit: Working
- [ ] Export Selected: Working
- [ ] All V3 features: Still working

**V4 is production ready!** 🎉
