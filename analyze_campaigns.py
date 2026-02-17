#!/usr/bin/env python3
"""Analyze CTRBooster campaign backup files."""

import json
import os
from pathlib import Path
from collections import Counter

# File paths
base_dir = Path("/Users/sean/Documents/Git/CTR - Architect Bank/CTRB Json backup files/campaign backups/CTR BOOSTER BACKUP - Febuary 17, 2025")

files = [
    "CTR campaigns(1725).json",
    "VPS Campaign 1 (575).json",
    "VPS Campaign 2 (575).json",
    "VPS Campaign 3 (575).json"
]

print("=" * 80)
print("CTR BOOSTER CAMPAIGN BACKUP ANALYSIS")
print("=" * 80)
print()

all_types = Counter()
total_campaigns = 0

for filename in files:
    filepath = base_dir / filename

    print(f"\n📁 File: {filename}")
    print("-" * 80)

    # Check if file exists
    if not filepath.exists():
        print(f"   ❌ File not found")
        continue

    # Get file size
    file_size = filepath.stat().st_size
    file_size_mb = file_size / (1024 * 1024)
    print(f"   Size: {file_size_mb:.2f} MB ({file_size:,} bytes)")

    # Load and analyze JSON
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        campaign_count = len(data)
        total_campaigns += campaign_count
        print(f"   Campaigns: {campaign_count:,}")

        # Extract Type values
        types = Counter()
        for campaign in data:
            campaign_type = campaign.get('Type', 'UNKNOWN')
            types[campaign_type] += 1
            all_types[campaign_type] += 1

        print(f"   Campaign Types:")
        for campaign_type, count in types.most_common():
            percentage = (count / campaign_count) * 100
            print(f"      • {campaign_type}: {count:,} ({percentage:.1f}%)")

        # Show sample campaign IDs and ProjectNames
        print(f"   Sample Campaigns (first 5):")
        for i, campaign in enumerate(data[:5], 1):
            proj_name = campaign.get('ProjectName', 'N/A')
            camp_id = campaign.get('id', 'N/A')
            camp_type = campaign.get('Type', 'N/A')
            print(f"      {i}. [{camp_type}] ID:{camp_id} - {proj_name[:50]}")

    except json.JSONDecodeError as e:
        print(f"   ❌ JSON parse error: {e}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "=" * 80)
print("SUMMARY ACROSS ALL FILES")
print("=" * 80)
print(f"Total Campaigns: {total_campaigns:,}")
print(f"\nAll Campaign Types Found:")
for campaign_type, count in all_types.most_common():
    percentage = (count / total_campaigns) * 100 if total_campaigns > 0 else 0
    print(f"   • {campaign_type}: {count:,} ({percentage:.1f}%)")
print()
