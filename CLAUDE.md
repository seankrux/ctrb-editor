# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CTRBooster Campaign Management Suite - Tools for creating, editing, and managing CTRBooster backup files with support for 5 campaign types (GSearch, GMap, RefDVisit, GSearchRef, DirectVisit).

**Technology Stack:**
- Python 3 (CLI tool and analyzer)
- Vanilla HTML/CSS/JavaScript (web editor)
- JSON data format (CTRBooster backup files)

## Running the Tools

### Web Editor (Primary Interface)
```bash
# macOS
open ctrb_web_editor_v2.1.html

# Windows
start ctrb_web_editor_v2.1.html

# Linux
xdg-open ctrb_web_editor_v2.1.html
```

The latest version is `ctrb_web_editor_v2.1.html`. Previous versions (`ctrb_web_editor_v2.html`, `ctrb_web_editor.html`) are kept for reference.

### Python CLI Tool
```bash
# Interactive mode
python3 ctrb_campaign_manager.py

# Programmatic usage
python3
>>> from ctrb_campaign_manager import CampaignBuilder, CampaignManager, QuickTemplates
>>> campaign = QuickTemplates.gmap_local("My Business", 40.7128, -74.0060, ["https://maps.google.com/..."])
>>> manager = CampaignManager()
>>> manager.add_campaign(campaign)
>>> manager.save_to_file("output.json")
```

### Analysis Tool
```bash
python3 analyze_campaigns.py
```

Note: Update the `base_dir` path in `analyze_campaigns.py` to point to your backup files location.

## Campaign Architecture

### Campaign Types

Each campaign type simulates different user behavior patterns:

| Type | Purpose | Key Timing Fields | Typical Use Case |
|------|---------|-------------------|------------------|
| **GSearch** | Organic search traffic | `TimeinGooglePagesMin/Max` (15-45s) | Brand searches, keyword visibility |
| **GMap** | Maps engagement | `TimeOfReferrelMin/Max` (30-90s) | Local business clicks, phone calls |
| **RefDVisit** | Referral → website | `TimeOfReferrelMin/Max` (60-120s) | Maps to website, social to website |
| **GSearchRef** | Search → referral → site | Both Google + Referral timing | Complex multi-step journeys |
| **DirectVisit** | Direct URL access | No referral timing | Bookmark clicks, direct entry |

### Campaign Type Configurations

**GSearch:**
- Requires: `lstKeywords` (search terms), `lstSites` (target URLs)
- Sets: `TimeinGooglePagesMin/Max`, `TargetSearchEngine: "Google"`, `MaxPages: "3"`
- Workflow: Search → Browse results → Click target

**GMap:**
- Requires: `lstSites` (Google Maps URLs in various formats)
- Optional: `Keywords` for actions like `["tel:+1234567890"]`
- Supports: Place IDs, CIDs, short links, viewer URLs

**RefDVisit:**
- Requires: `lstSites` (referral sources), `Keywords` (action URLs)
- Two-phase: Referral phase (30-90s) → Main visit (180-250s)
- Use for: Maps → Website, Social → Website

### Critical Data Structure

All campaigns must have **exactly 72 required fields**. Missing fields will cause CTRBooster import failures.

**Key Field Types:**
- **Strings that look like numbers:** `"numberOfVisits": "1000"`, `"TimeOfVisitMin": "180"`
- **Integer (NOT string):** `"GMapRetriesFails": 0` (common validation failure)
- **Boolean:** `"Checked": true`, `"UseCustomProxy": false`
- **Arrays:** `lstCustomGeolocations`, `lstSites`, `Keywords`, `lstKeywords`

**Progress String Format:**
- Must be: `"0 of 1000"` (with space, lowercase "of")
- Fields: `doneVisits`, `doneDailyVisits`

**Geolocation Format:**
- Format: `"40.123456:-74.123456"` (lat:lon with colon separator)
- Array: `lstCustomGeolocations: ["40.7128:-74.0060", "40.7129:-74.0061", ...]`
- Typical count: 50-75 points per campaign

**Auto-Generated Fields:**
```python
"id": "3057963292"  # Random 10-digit string
"CreateTime": "2025-02-14T10:30:00"  # ISO 8601
"dtTodayDate": "2025-02-14T00:00:00"
"nextRun": "2025-02-15T08:00:00"
"Filename": "GMap_MyBusiness_3057963292.txt"
```

## CampaignBuilder Pattern

The Python tool uses a fluent builder pattern:

```python
campaign = (CampaignBuilder("GMap")
    .set_project_name("Business Name | Campaign Type")
    .set_geolocation(lat, lon, radius_miles=1.0, count=75)
    .set_target_sites(["https://maps.google.com/..."])
    .set_keywords(["tel:+1234567890", "https://website.com"])
    .set_visits(1000, daily_limit=3)
    .set_timing(visit_min=180, visit_max=250)
    .set_schedule(start_time="08:00 AM", end_time="11:00 PM")
    .set_device(device_type="Mobile", mobile_percentage=50.0)
    .build())
```

**Common Methods:**
- `.set_geolocation(lat, lon, radius_miles, count)` - Generates random geolocations
- `.set_visits(total, daily_limit)` - Sets `numberOfVisits` and `DailyLimit`
- `.set_timing(visit_min, visit_max, delay_min, delay_max)` - Visit durations and delays
- `.enable_custom_proxy(enabled, proxies)` - Proxy configuration
- `.set_custom_field(key, value)` - Direct field access

## QuickTemplates

Pre-configured templates for common scenarios:

```python
# Local business Maps campaign
QuickTemplates.gmap_local(project_name, lat, lon, gmb_urls, phone_number=None, visits=1000)

# Brand search campaign
QuickTemplates.gsearch_brand(project_name, lat, lon, search_keywords, visits=1000)

# Referral traffic campaign
QuickTemplates.referal_visit(project_name, lat, lon, target_sites, action_keywords, visits=1000)
```

## File Format Validation

Before importing to CTRBooster, validate:

1. **JSON Syntax:** `python3 -m json.tool your_file.json`
2. **Campaign Count:** `jq 'length' your_file.json`
3. **Type Distribution:** `jq '[.[].Type] | unique' your_file.json`
4. **Field Count:** Each campaign must have all 72 fields
5. **Progress Format:** Must match `"0 of 1000"` pattern
6. **GMapRetriesFails:** Must be integer `0`, not string `"0"`

## Common Workflow Patterns

### Creating Campaigns from Scratch
1. Use web editor (`ctrb_web_editor_v2.1.html`) OR Python CLI
2. Select campaign type
3. Enter coordinates (find on Google Maps: right-click → coordinates)
4. Set visit counts and timing
5. Add target URLs and keywords
6. Export JSON file
7. Validate before importing to CTRBooster

### Modifying Existing Backups
1. Load existing JSON: `manager.load_from_file("backup.json")`
2. View campaigns: `manager.list_campaigns()`
3. Add new campaigns: `manager.add_campaign(campaign)`
4. Edit campaigns: Access by index, modify fields
5. Save: `manager.save_to_file("modified_backup.json")`

### Batch Campaign Creation
```python
manager = CampaignManager()
locations = [(40.7128, -74.0060), (40.7589, -73.9851), ...]

for lat, lon in locations:
    campaign = QuickTemplates.gmap_local(
        f"Business {lat}",
        lat, lon,
        ["https://maps.google.com/..."]
    )
    manager.add_campaign(campaign)

manager.save_to_file("batch_output.json")
```

## Campaign Templates (from Real Data)

Based on analysis of 3,450 campaigns:

**Template A - Conservative (100 visits):**
- Radius: 3 miles
- Daily limit: 2
- Geo points: 50
- Delays: 1800-2400 seconds (30-40 min)

**Template B/C - Production (1000 visits):**
- Radius: 1 mile
- Daily limit: 3
- Geo points: 75
- Delays: 1300-2000 seconds (21-33 min)

**Typical Distribution:**
- 40% GSearch (brand + keyword searches)
- 40% GMap (local engagement)
- 18% RefDVisit (referral traffic)
- 1-2% Other types

## URL Format Reference

### Google Maps URL Formats (all supported):
```
https://www.google.com/maps/place/...
https://maps.google.com/maps?cid=12345678901234567890
https://www.google.com/viewer/place?mid=/g/11abc123
https://goo.gl/maps/abc123
```

### Action Keywords:
```python
"Keywords": [
    "tel:+12125551234",  # Phone click
    "https://example.com/page",  # Website URL
    "https://facebook.com/business",  # Social media
    "https://maps.google.com/..."  # Directions
]
```

## Troubleshooting

### Import Fails
- **Symptom:** CTRBooster rejects file
- **Check:** Run `python3 -m json.tool file.json` to validate syntax
- **Common issue:** `GMapRetriesFails` is string instead of integer
- **Fix:** Ensure field is `0` not `"0"`

### Campaigns Don't Run
- **Check:** `"Checked": true` (not false)
- **Check:** `nextRun` is future datetime
- **Check:** Current time within `strStartTime` - `strEndTime` window

### Geolocation Errors
- **Valid range:** Latitude: -90 to 90, Longitude: -180 to 180
- **Format:** Exactly `"lat:lon"` with colon, no spaces
- **Precision:** 6 decimal places recommended

## Important Notes

1. **File Naming:** Latest web editor is `v2.1`, but all versions produce compatible JSON
2. **Dependencies:** Pure Python stdlib - no pip installs needed
3. **Python Version:** Requires Python 3.6+ (uses f-strings, type hints)
4. **JSON Encoding:** Always UTF-8
5. **Campaign IDs:** Auto-generated 10-digit random numbers, must be unique
6. **Timestamps:** ISO 8601 format with timezone info
