# CTRBooster Campaign Management Suite

A complete toolkit for creating, editing, and managing CTRBooster backup files with support for all 5 campaign types.

---

## 📁 Files in This Suite

| File | Description | Type |
|------|-------------|------|
| **ctrb_campaign_manager.py** | Command-line campaign editor | Python CLI |
| **ctrb_web_editor.html** | Web-based visual editor | HTML/JavaScript |
| **analyze_campaigns.py** | Backup file analyzer | Python Script |
| **CAMPAIGN_EDITOR_GUIDE.md** | Complete usage guide | Documentation |
| **CAMPAIGN_EXAMPLES.json** | Example campaigns & templates | Reference |
| **ctrb_export.schema.json** | JSON schema validator | Schema |
| **ctrb_export_tools.py** | Parser & normalizer utilities | Python Tools |

---

## 🚀 Quick Start

### Option 1: Web Editor (Easiest - No Coding)

1. **Open the editor:**
   ```bash
   open ctrb_web_editor.html
   ```

2. **Create campaigns:**
   - Click "Create Campaign" tab
   - Fill in the form
   - Click "Create Campaign" button

3. **Export file:**
   - Go to "Import/Export" tab
   - Click "Download Backup JSON"
   - Upload to CTRBooster tool

### Option 2: Python CLI (Advanced)

```bash
# Run interactive CLI
python3 ctrb_campaign_manager.py

# Or use programmatically
python3
>>> from ctrb_campaign_manager import CampaignBuilder, CampaignManager
>>> campaign = CampaignBuilder("GMap").set_project_name("Test").build()
>>> manager = CampaignManager()
>>> manager.add_campaign(campaign)
>>> manager.save_to_file("my_campaigns.json")
```

---

## 🎯 Supported Campaign Types

| Type | Purpose | Complexity | Use Case |
|------|---------|------------|----------|
| **GSearch** | Google Search traffic | ⭐⭐⭐ | Organic search visibility, brand searches |
| **GMap** | Google Maps engagement | ⭐⭐⭐ | Local business, Maps clicks, phone calls |
| **RefDVisit** | Referral direct visits | ⭐⭐⭐⭐ | Website traffic, social media, directions |
| **GSearchRef** | Search + Referral | ⭐⭐⭐⭐⭐ | Complex multi-step journeys |
| **DirectVisit** | Direct website traffic | ⭐⭐ | Bookmark clicks, direct URL entry |

---

## 📊 Analyzed Data

Based on analysis of 3,450 campaigns from February 2025 backup:

- **40.2%** GSearch campaigns
- **40.2%** GMap campaigns
- **18.0%** RefDVisit campaigns
- **1.5%** GSearchRef campaigns
- **0.1%** DirectVisit campaigns

**Geographic Coverage:**
- New York (4 cities)
- Florida (5 cities)
- California (1 city)
- Texas (2 cities)
- South Carolina (1 city)

**Business Types:**
- Moving companies
- HVAC contractors
- Roofing companies
- Plumbing services
- Restaurants

---

## 🛠️ Features

### Campaign Builder
- ✅ All 5 campaign types supported
- ✅ Template-based creation
- ✅ Auto-generate IDs, timestamps, filenames
- ✅ Geolocation generator
- ✅ Field validation
- ✅ Progress string formatting

### Campaign Manager
- ✅ Import existing backups
- ✅ Export compatible JSON files
- ✅ Add/Edit/Delete campaigns
- ✅ Batch operations
- ✅ Statistics & analytics
- ✅ Campaign filtering by type

### Web Editor
- ✅ Visual form-based creation
- ✅ No coding required
- ✅ Real-time preview
- ✅ Import/Export UI
- ✅ Campaign statistics dashboard
- ✅ Campaign list management

### Validation
- ✅ Schema validation
- ✅ 72 required fields checked
- ✅ Data type verification
- ✅ Format validation
- ✅ 100% CTRBooster compatible

---

## 📖 Documentation

### Main Guide
**[CAMPAIGN_EDITOR_GUIDE.md](./CAMPAIGN_EDITOR_GUIDE.md)**
- Complete usage instructions
- Campaign type explanations
- Examples for each type
- Advanced customization
- Troubleshooting

### Examples
**[CAMPAIGN_EXAMPLES.json](./CAMPAIGN_EXAMPLES.json)**
- Sample campaigns for each type
- Real-world scenarios
- Field comparison tables
- Template configurations
- Validation checklist

---

## 💡 Common Use Cases

### 1. Local Business Maps Engagement

```python
from ctrb_campaign_manager import QuickTemplates

campaign = QuickTemplates.gmap_local(
    project_name="My Business | Local",
    lat=40.7128,
    lon=-74.0060,
    gmb_urls=["https://maps.google.com/..."],
    phone_number="+12125551234",
    visits=1000
)
```

### 2. Brand Search Campaign

```python
campaign = QuickTemplates.gsearch_brand(
    project_name="My Brand | Search",
    lat=40.7128,
    lon=-74.0060,
    search_keywords=["my brand name", "my business"],
    visits=1000
)
```

### 3. Website Referral Traffic

```python
campaign = QuickTemplates.referal_visit(
    project_name="My Site | Referral",
    lat=40.7128,
    lon=-74.0060,
    target_sites=["https://example.com"],
    action_keywords=["tel:+1234567890", "https://facebook.com/..."],
    visits=100
)
```

---

## 🔧 Advanced Features

### Custom Campaign Builder

```python
from ctrb_campaign_manager import CampaignBuilder

campaign = (CampaignBuilder("GMap")
    .set_project_name("Advanced Campaign")
    .set_geolocation(40.7128, -74.0060, radius_miles=1.5, count=100)
    .set_visits(2000, daily_limit=5)
    .set_timing(
        visit_min=200,
        visit_max=300,
        delay_min=1000,
        delay_max=1500
    )
    .set_schedule(start_time="08:00 AM", end_time="11:00 PM")
    .set_device(device_type="Mobile", mobile_percentage=50.0)
    .enable_custom_proxy(True, ["http://proxy.example.com:8080"])
    .build())
```

### Batch Operations

```python
from ctrb_campaign_manager import CampaignManager

manager = CampaignManager()

# Load existing backup
manager.load_from_file("existing_backup.json")

# Add new campaigns
for i in range(10):
    campaign = QuickTemplates.gmap_local(
        project_name=f"Location {i+1}",
        lat=40.7128 + (i * 0.01),
        lon=-74.0060 + (i * 0.01),
        gmb_urls=["https://maps.google.com/..."]
    )
    manager.add_campaign(campaign)

# Save combined file
manager.save_to_file("combined_backup.json")

# View stats
stats = manager.get_statistics()
print(f"Total: {stats['total_campaigns']} campaigns")
```

---

## 📋 File Format Details

### Required Structure

```json
[
  {
    // 72 required fields per campaign
    "id": "3057963292",
    "ProjectName": "My Campaign",
    "Type": "GMap",
    "numberOfVisits": "1000",
    "lstCustomGeolocations": ["40.7128:-74.0060", "..."],
    // ... 67 more fields
  }
]
```

### Key Fields by Type

**GSearch:**
```json
{
  "Type": "GSearch",
  "TimeinGooglePagesMin": "15",
  "TimeinGooglePagesMax": "45",
  "TargetSearchEngine": "Google",
  "MaxPages": "3"
}
```

**GMap:**
```json
{
  "Type": "GMap",
  "lstSites": ["https://maps.google.com/..."],
  "Keywords": ["tel:+1234567890"]
}
```

**RefDVisit:**
```json
{
  "Type": "RefDVisit",
  "TimeOfReferrelMin": "60",
  "TimeOfReferrelMax": "120",
  "lstSites": ["https://maps.google.com/..."],
  "Keywords": ["https://website.com", "tel:+1234567890"]
}
```

---

## ⚙️ Configuration Templates

### Template A: Conservative (100 visits)
- 3-mile radius
- 2 daily limit
- 50 geo points
- 30-40 min delays
- Best for: Testing

### Template B: Standard (1000 visits)
- 1-mile radius
- 3 daily limit
- 75 geo points
- 21-33 min delays
- Best for: Production

### Template C: Aggressive (1000 visits)
- 1-mile radius
- 3 daily limit
- 75 geo points
- 21-33 min delays
- 2 daily targets
- Best for: Maximum impact

---

## 🔍 Analysis Tools

### Analyze Existing Backups

```bash
python3 analyze_campaigns.py
```

Output:
- Campaign counts
- Type distribution
- Sample campaigns
- File sizes
- Summary statistics

### Validate Files

```bash
# Using Python
python3 -m json.tool your_backup.json

# Using jq
jq 'length' your_backup.json
jq '[.[].Type] | unique' your_backup.json
```

---

## ✅ Validation Checklist

Before importing to CTRBooster:

- [ ] JSON syntax is valid
- [ ] All campaigns have 72 required fields
- [ ] `GMapRetriesFails` is integer (not string)
- [ ] Progress strings: `"0 of 1000"` format
- [ ] Geolocations: `"lat:lon"` format
- [ ] Campaign IDs are unique
- [ ] Dates in ISO 8601 format
- [ ] Type field is one of: GSearch, GMap, RefDVisit, GSearchRef, DirectVisit

---

## 🎓 Learning Resources

1. **[CAMPAIGN_EDITOR_GUIDE.md](./CAMPAIGN_EDITOR_GUIDE.md)** - Complete guide
2. **[CAMPAIGN_EXAMPLES.json](./CAMPAIGN_EXAMPLES.json)** - Working examples
3. **ctrb_export.schema.json** - Field definitions
4. **ctrb_reverse_engineering_report.md** - Technical analysis

---

## 📊 Statistics from Real Data

**From 3,450 analyzed campaigns:**

- Average visits per campaign: 905
- Most common daily limit: 3
- Most common radius: 1 mile
- Geo points range: 50-75
- Visit duration: 180-250 seconds
- Delay between visits: 1300-2400 seconds

**Campaign Naming Patterns:**
- `BUSINESS | BRAND` - 40%
- `BUSINESS | SERVICE` - 35%
- `BUSINESS | LONG` - 15%
- Other - 10%

---

## ⚠️ Important Notes

1. **Compatibility**: All generated files are 100% compatible with CTRBooster
2. **Validation**: Built-in validation ensures proper format
3. **Backup**: Always backup existing files before modifying
4. **Testing**: Test with small campaigns first
5. **Uniqueness**: Campaign IDs are auto-generated and unique

---

## 🔗 Quick Command Reference

```bash
# Web Editor
open ctrb_web_editor.html

# CLI Tool
python3 ctrb_campaign_manager.py

# Analyzer
python3 analyze_campaigns.py

# Validate JSON
python3 -m json.tool backup.json

# Extract types
jq '[.[].Type] | unique' backup.json

# Count campaigns
jq 'length' backup.json
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Import fails:**
- Check JSON syntax
- Validate all 72 fields present
- Verify `GMapRetriesFails` is integer

**Campaigns don't run:**
- Check `Checked: true`
- Verify `nextRun` is future
- Confirm operating hours

**Geolocations invalid:**
- Latitude: -90 to 90
- Longitude: -180 to 180
- Format: "40.123456:-74.123456"

---

## 📈 Version History

**v1.0** (February 2026)
- Initial release
- Support for all 5 campaign types
- Web and CLI editors
- Full validation
- Template system
- Batch operations

---

**Made with ❤️ for CTRBooster users**

For questions or issues, refer to the complete guide: [CAMPAIGN_EDITOR_GUIDE.md](./CAMPAIGN_EDITOR_GUIDE.md)

---

Made with 💛 by Sean G
