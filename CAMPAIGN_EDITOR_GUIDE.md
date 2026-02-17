# CTRBooster Campaign Editor - Complete Guide

This guide explains how to use the campaign editor tools to create, edit, and manage CTRBooster backup files.

---

## 📦 What's Included

1. **`ctrb_campaign_manager.py`** - Command-line Python tool
2. **`ctrb_web_editor.html`** - Web-based GUI editor
3. **`analyze_campaigns.py`** - Backup file analyzer

---

## 🚀 Quick Start

### Option 1: Web Editor (Easiest)

1. Open `ctrb_web_editor.html` in your web browser
2. Click "Create Campaign" tab
3. Fill in the form
4. Click "Create Campaign"
5. Go to "Import/Export" tab and click "Download Backup JSON"

### Option 2: Python CLI

```bash
python3 ctrb_campaign_manager.py
```

Then follow the interactive prompts.

---

## 🌐 Web Editor Features

### Create Campaign Tab

**Campaign Types:**
- **GSearch** - Google Search organic traffic simulation
- **GMap** - Google Maps engagement
- **RefDVisit** - Referral direct visit (Maps → Website)
- **GSearchRef** - Search + Referral combined
- **DirectVisit** - Direct website traffic

**Required Fields:**
- Project Name
- Latitude/Longitude (center point for geolocation)
- Campaign Type

**Optional But Recommended:**
- Total Visits (default: 1000)
- Daily Limit (default: 3)
- Target Sites (URLs to visit)
- Keywords (actions to trigger)

### Manage Campaigns Tab

- View all loaded campaigns
- Delete campaigns
- See campaign details

### Import/Export Tab

**Import:**
1. Click "Choose JSON File"
2. Select your existing CTRBooster backup file
3. Campaigns will be loaded

**Export:**
1. Click "Download Backup JSON"
2. File will be saved as `ctrb_backup_[timestamp].json`
3. This file is compatible with CTRBooster tool

### Statistics Tab

View:
- Total campaigns
- Total planned visits
- Campaign type distribution

---

## 💻 Python CLI Features

### Main Menu Options

```
1. Create new campaign       - Create single campaign interactively
2. Load backup file          - Import existing backup
3. View campaigns            - List all campaigns
4. Edit campaign             - Modify campaign fields
5. Delete campaign           - Remove a campaign
6. Save backup file          - Export to JSON
7. Statistics                - View campaign stats
8. Batch create from template - Create multiple campaigns quickly
9. Exit
```

### Example: Creating a GMap Campaign

```python
from ctrb_campaign_manager import CampaignBuilder, CampaignManager

# Create manager
manager = CampaignManager()

# Build campaign
campaign = (CampaignBuilder("GMap")
    .set_project_name("My Local Business")
    .set_geolocation(40.7128, -74.0060, radius_miles=1.0, count=75)
    .set_target_sites([
        "https://maps.google.com/maps?cid=12345678901234567890"
    ])
    .set_keywords(["tel:+12125551234"])
    .set_visits(1000, daily_limit=3)
    .build())

# Add to manager
manager.add_campaign(campaign)

# Save to file
manager.save_to_file("my_backup.json")
```

### Example: Batch Create Using Templates

```python
from ctrb_campaign_manager import QuickTemplates, CampaignManager

manager = CampaignManager()

# Create 10 GSearch brand campaigns
for i in range(10):
    campaign = QuickTemplates.gsearch_brand(
        project_name=f"Brand Campaign {i+1}",
        lat=40.7128,
        lon=-74.0060,
        search_keywords=["my brand name", "my business"],
        visits=1000
    )
    manager.add_campaign(campaign)

# Save all
manager.save_to_file("brand_campaigns.json")
```

---

## 🎯 Campaign Type Guide

### GSearch (Google Search)

**Use Case:** Simulate organic search traffic

**Key Settings:**
- `TimeinGooglePagesMin/Max`: 15-45 seconds on search results
- `MaxPages`: 3 (browse multiple search result pages)
- `TargetSearchEngine`: "Google"

**Required:**
- Keywords to search for
- Target URLs to click

**Example Workflow:**
1. User searches "best pizza NYC"
2. Spends 15-45 seconds on search results
3. Clicks through to business listing
4. Stays 180-250 seconds

---

### GMap (Google Maps)

**Use Case:** Local business Maps engagement

**Key Settings:**
- `lstSites`: Google Maps URLs (various formats supported)
- `UseGMBInteraction`: Can enable GMB interactions
- Tight geolocation radius (1 mile typical)

**Required:**
- Google Maps URLs (place ID, CID, or short links)
- Geolocations around business

**Typical Keywords:**
- `tel:+1234567890` (phone click)
- Directions URLs
- Website URLs

---

### RefDVisit (Referral Direct Visit)

**Use Case:** Complex multi-step referral traffic

**Key Settings:**
- `TimeOfReferrelMin/Max`: 30-90 seconds on referral
- Multiple target sites
- Internal page navigation

**Workflow:**
1. Referral phase: 30-90 seconds
2. Main visit: 180-250 seconds
3. Internal navigation: 90-120 seconds

**Best For:**
- Website traffic from Maps
- Social media clicks
- Direction clicks

---

### GSearchRef (Search + Referral)

**Use Case:** Combined search and referral journey

**Key Settings:**
- Combines GSearch and RefDVisit timing
- Longer `TimeinGooglePages`: 20-60 seconds
- Multiple interaction points

**Workflow:**
1. Search on Google
2. View search results
3. Click to Maps/listing
4. Referral to website
5. Browse website

---

### DirectVisit

**Use Case:** Direct website traffic (no referrer)

**Key Settings:**
- No Google interaction
- No geolocation needed
- Direct URL in `TargetUrl`

**Best For:**
- Simulating bookmark clicks
- Direct URL entry
- Minimal tracking footprint

---

## 📍 Geolocation Configuration

### Understanding Geolocations

The `lstCustomGeolocations` array contains latitude:longitude pairs that the bot cycles through to appear as if visits are coming from different locations in the target area.

### Generating Geolocations

**Web Editor:**
- Enter center latitude/longitude
- Set radius in miles
- Set count (50 for Template A, 75 for Template B/C)

**Python:**
```python
.set_geolocation(
    lat=40.7128,        # Center latitude
    lon=-74.0060,       # Center longitude
    radius_miles=1.0,   # Search radius
    count=75            # Number of points
)
```

### Finding Coordinates

1. Go to Google Maps
2. Right-click on your location
3. Click the coordinates to copy them
4. Format: `40.7128, -74.0060`

---

## ⏱️ Timing Configuration

### Visit Duration
- `TimeOfVisitMin/Max`: Total time on main page
- Default: 180-250 seconds (3-4 minutes)
- Appears as engaged visitor

### Internal Navigation
- `TimeOfInternalMin/Max`: Time on internal pages
- Default: 90-120 seconds
- Simulates browsing multiple pages

### Referral Time
- `TimeOfReferrelMin/Max`: Time on referral source
- GSearch/GMap: 30-90 seconds
- RefDVisit: 60-120 seconds

### Delays Between Visits
- `MinDelayAfterVisit/MaxDelayAfterVisit`: Cooldown period
- Template A: 1800-2400 seconds (30-40 min)
- Template B/C: 1300-2000 seconds (21-33 min)

---

## 🔧 Advanced Customization

### Custom Proxy Configuration

```python
builder.enable_custom_proxy(
    enabled=True,
    proxies=[
        "http://proxy1.example.com:8080",
        "http://proxy2.example.com:8080"
    ]
)
```

### Mobile Device Simulation

```python
builder.set_device(
    device_type="Mobile",
    mobile_percentage=100.0
)
```

### Operating Hours

```python
builder.set_schedule(
    start_time="08:00 AM",
    end_time="11:00 PM"
)
```

### Custom Field Modification

```python
builder.set_custom_field("UseGMBInteraction", True)
builder.set_custom_field("MaxPages", "5")
```

---

## 📊 File Format Compatibility

### Supported Formats

**Input:**
- CTRBooster JSON backup files
- Arrays of campaign objects
- UTF-8 encoded

**Output:**
- Compatible with CTRBooster import
- Preserves all 72 required fields
- Validates progress strings
- Auto-generates IDs and timestamps

### Validation

All generated files include:
✅ All 72 required fields
✅ Proper data types (strings vs numbers)
✅ Valid progress format ("0 of 1000")
✅ ISO 8601 timestamps
✅ Unique campaign IDs
✅ Valid geolocation format (lat:lon)

---

## 🛠️ Troubleshooting

### Campaign Won't Import to CTRBooster

**Issue:** File format error

**Solution:**
1. Validate JSON syntax: `python3 -m json.tool your_file.json`
2. Check all required fields are present
3. Ensure `GMapRetriesFails` is integer (not string)
4. Verify progress strings format: "0 of 100"

### Geolocations Not Working

**Issue:** Invalid coordinates

**Solution:**
- Latitude: -90 to 90
- Longitude: -180 to 180
- Format: "40.123456:-74.123456" (6 decimal places)

### Campaign Not Running

**Issue:** Schedule or limits

**Check:**
- `Checked`: must be `true`
- `nextRun`: should be future datetime
- `strStartTime/strEndTime`: within operating hours
- `doneVisits`: not already completed

---

## 💡 Best Practices

### Campaign Naming

Use descriptive names with patterns:
- `BUSINESS NAME | BRAND` - Brand search campaigns
- `BUSINESS NAME | MOVING HELP` - Service-specific
- `BUSINESS NAME | LONG` - Long-tail keywords

### Visit Quotas

**Conservative (Template A):**
- 100 visits
- 2 daily limit
- 3-mile radius
- Good for testing

**Aggressive (Template B/C):**
- 1000 visits
- 3 daily limit
- 1-mile radius
- Production campaigns

### Geolocation Density

- **50 points**: Wider area, 3-mile radius
- **75 points**: Focused area, 1-mile radius
- More points = more variety = looks more organic

### Campaign Mix

**Balanced Strategy:**
- 40% GSearch (brand + keywords)
- 40% GMap (local engagement)
- 18% RefDVisit (referral traffic)
- 1-2% Other (GSearchRef, DirectVisit)

---

## 📝 Examples

### Example 1: HVAC Company (Los Angeles)

```python
# GMap campaign for local HVAC business
campaign = (CampaignBuilder("GMap")
    .set_project_name("Orion HVAC | Van Nuys")
    .set_geolocation(34.2120, -118.4828, radius_miles=1.0, count=75)
    .set_target_sites([
        "https://www.google.com/viewer/place?mid=/g/11twv43hk6"
    ])
    .set_keywords([
        "https://myorionhvac.com/services/hvac-company-van-nuys-ca/?utm_campaign=gmb"
    ])
    .set_visits(1000, daily_limit=3)
    .build())
```

### Example 2: Moving Company (Brooklyn)

```python
# GSearch brand campaign
campaign = QuickTemplates.gsearch_brand(
    project_name="Mint Movers | Brooklyn",
    lat=40.6782,
    lon=-73.9442,
    search_keywords=["mint movers brooklyn", "brooklyn movers"],
    visits=1000
)
```

### Example 3: Roofing Company (Miami)

```python
# RefDVisit campaign with social media
campaign = QuickTemplates.referal_visit(
    project_name="Real Roofing | Miami",
    lat=25.7617,
    lon=-80.1918,
    target_sites=[
        "https://www.google.com/viewer/place?mid=/g/11rvcv1bht"
    ],
    action_keywords=[
        "https://www.facebook.com/realroofingcontractormiamiinc/",
        "https://www.instagram.com/realroofingcontractormiamiinc/"
    ],
    visits=1000
)
```

---

## ⚠️ Important Notes

1. **File Compatibility**: Generated files are 100% compatible with CTRBooster tool
2. **Auto-Generated Fields**: IDs, timestamps, and filenames are automatically created
3. **Validation**: All fields are validated before export
4. **Backup First**: Always backup existing files before importing
5. **Testing**: Test with small campaigns (100 visits) before scaling

---

## 🔗 Quick Reference

### File Locations

```
CTRB Json backup files/
├── ctrb_campaign_manager.py    # Python CLI tool
├── ctrb_web_editor.html         # Web GUI
├── analyze_campaigns.py         # Analyzer
└── CAMPAIGN_EDITOR_GUIDE.md     # This guide
```

### Command Quick Reference

```bash
# Run CLI tool
python3 ctrb_campaign_manager.py

# Analyze backup
python3 analyze_campaigns.py

# Open web editor
open ctrb_web_editor.html  # Mac
start ctrb_web_editor.html # Windows
```

### Campaign Type Quick Reference

| Type | Use Case | Complexity | Typical Daily |
|------|----------|------------|---------------|
| GSearch | Organic search | Medium | 2-3 |
| GMap | Maps engagement | Medium | 3 |
| RefDVisit | Referral traffic | High | 2 |
| GSearchRef | Search+Referral | Very High | 1-2 |
| DirectVisit | Direct traffic | Low | 2 |

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Validate your JSON files
3. Review campaign type requirements
4. Test with minimal campaigns first

---

**Version:** 1.0
**Last Updated:** February 2026
