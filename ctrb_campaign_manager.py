#!/usr/bin/env python3
"""
CTRBooster Campaign Manager
A tool to create, edit, and manage CTRBooster backup files.

Usage:
    python3 ctrb_campaign_manager.py
"""

import json
import random
import string
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import copy

# ============================================================================
# CAMPAIGN TEMPLATES
# ============================================================================

BASE_CAMPAIGN_TEMPLATE = {
    "strGoogleSearchType": "Default",
    "strMiles": "1",
    "UseXMiles": True,
    "UseGeolocation": True,
    "strNextDevice": "Desktop",
    "AuthorId": "",
    "MatchExactUrl": False,
    "id": "",  # Will be generated
    "Checked": True,
    "UseCustomProxy": False,
    "UseGMBInteraction": False,
    "UseKnowdGraphInteraction": False,
    "UsePhoneNumberClick": False,
    "ProjectName": "",
    "Type": "RefDVisit",
    "numberOfVisits": "1000",
    "doneVisits": "0 of 1000",
    "doneDailyVisits": "0 of 1",
    "TimeOfVisitMin": "180",
    "TimeOfVisitMax": "250",
    "InternalVisitsCount": "1",
    "TimeOfInternalMin": "90",
    "TimeOfInternalMax": "120",
    "TimeOfReferrelMin": "30",
    "TimeOfReferrelMax": "90",
    "Threads": "",
    "TimeinGooglePagesMin": "0",
    "TimeinGooglePagesMax": "0",
    "MaxPages": "0",
    "TargetSearchEngine": "",
    "TargetUrl": "",
    "TargetName": "",
    "CreateTime": "",  # Will be generated
    "lstUsedProxies": [],
    "lstCustomProxies": [],
    "lstCustomGeolocations": [],
    "lstKeywords": [],
    "lstSites": [],
    "lstInternalIgnoreLinks": [],
    "GMapRetries": "",
    "GMapRetriesFails": 0,
    "DailyLimit": "3",
    "DailyLimitMin": "1",
    "DailyLimitMax": "0",
    "dtTodayDate": "",  # Will be generated
    "MinDelayAfterVisit": "1300",
    "MaxDelayAfterVisit": "2000",
    "DeviceType": "Desktop",
    "VisitCompetitor": False,
    "strStartTime": "10:00 AM",
    "strEndTime": "09:00 PM",
    "strMobileUseragentPecentage": "0",
    "strMobileVisits": "",
    "strDesktopVisits": "",
    "Keywords": [],
    "UsedKeywords": [],
    "Filename": "",  # Will be generated
    "nextRun": "",  # Will be generated
    "UseCustomLanguage": False,
    "CustomLanguage": "",
}

# Campaign type-specific configurations
CAMPAIGN_TYPE_CONFIGS = {
    "GSearch": {
        "Type": "GSearch",
        "TimeinGooglePagesMin": "15",
        "TimeinGooglePagesMax": "45",
        "TargetSearchEngine": "Google",
        "MaxPages": "3",
        "TimeOfReferrelMin": "0",
        "TimeOfReferrelMax": "0",
    },
    "GMap": {
        "Type": "GMap",
        "UseGMBInteraction": False,
        "TimeOfReferrelMin": "30",
        "TimeOfReferrelMax": "90",
        "TimeinGooglePagesMin": "10",
        "TimeinGooglePagesMax": "30",
    },
    "RefDVisit": {
        "Type": "RefDVisit",
        "TimeOfReferrelMin": "30",
        "TimeOfReferrelMax": "90",
        "TimeinGooglePagesMin": "0",
        "TimeinGooglePagesMax": "0",
    },
    "GSearchRef": {
        "Type": "GSearchRef",
        "TimeinGooglePagesMin": "20",
        "TimeinGooglePagesMax": "60",
        "TargetSearchEngine": "Google",
        "TimeOfReferrelMin": "30",
        "TimeOfReferrelMax": "90",
        "MaxPages": "2",
    },
    "DirectVisit": {
        "Type": "DirectVisit",
        "TimeOfReferrelMin": "0",
        "TimeOfReferrelMax": "0",
        "TimeinGooglePagesMin": "0",
        "TimeinGooglePagesMax": "0",
        "UseGeolocation": False,
    },
}


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================


def generate_campaign_id() -> str:
    """Generate a random campaign ID."""
    return str(random.randint(3000000000, 9999999999))


def generate_filename() -> str:
    """Generate a random filename in format: {num1}-{num2}."""
    num1 = random.randint(100000000, 999999999)
    num2 = random.randint(100000000, 999999999)
    return f"{num1}-{num2}"


def generate_datetime_now() -> str:
    """Generate current datetime in UI format."""
    return datetime.now().strftime("%-m/%-d/%Y %-I:%M:%S %p")


def generate_iso_datetime(offset_hours: int = 0) -> str:
    """Generate ISO 8601 datetime with offset."""
    dt = datetime.now() + timedelta(hours=offset_hours)
    # Format with timezone offset
    return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + dt.strftime("%z")


def generate_iso_date_midnight() -> str:
    """Generate ISO 8601 date at midnight."""
    dt = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    return dt.strftime("%Y-%m-%dT%H:%M:%S") + dt.strftime("%z")


def generate_geolocations(
    lat: float, lon: float, radius_miles: float, count: int = 75
) -> List[str]:
    """
    Generate random geolocations around a center point.

    Args:
        lat: Center latitude
        lon: Center longitude
        radius_miles: Radius in miles
        count: Number of points to generate

    Returns:
        List of "lat:lon" strings
    """
    # Convert miles to degrees (approximate)
    # 1 degree latitude ≈ 69 miles
    # 1 degree longitude ≈ 69 * cos(latitude) miles
    import math

    lat_range = radius_miles / 69.0
    lon_range = radius_miles / (69.0 * math.cos(math.radians(lat)))

    geolocations = []
    for _ in range(count):
        # Random offset within radius
        random_lat = lat + random.uniform(-lat_range, lat_range)
        random_lon = lon + random.uniform(-lon_range, lon_range)
        geolocations.append(f"{random_lat:.6f}:{random_lon:.6f}")

    return geolocations


def validate_progress_string(done: int, total: int) -> str:
    """Create progress string in format: '{done} of {total}'."""
    return f"{done} of {total}"


# ============================================================================
# CAMPAIGN BUILDER
# ============================================================================


class CampaignBuilder:
    """Builder class for creating CTRBooster campaigns."""

    def __init__(self, campaign_type: str = "RefDVisit"):
        """Initialize with campaign type."""
        if campaign_type not in CAMPAIGN_TYPE_CONFIGS:
            raise ValueError(
                f"Invalid campaign type: {campaign_type}. Must be one of: {list(CAMPAIGN_TYPE_CONFIGS.keys())}"
            )

        # Start with base template
        self.campaign = copy.deepcopy(BASE_CAMPAIGN_TEMPLATE)

        # Apply type-specific config
        type_config = CAMPAIGN_TYPE_CONFIGS[campaign_type]
        self.campaign.update(type_config)

        # Generate auto fields
        self._generate_auto_fields()

    def _generate_auto_fields(self):
        """Generate automatic fields like IDs and timestamps."""
        self.campaign["id"] = generate_campaign_id()
        self.campaign["Filename"] = generate_filename()
        self.campaign["CreateTime"] = generate_datetime_now()
        self.campaign["dtTodayDate"] = generate_iso_date_midnight()
        self.campaign["nextRun"] = generate_iso_datetime(offset_hours=1)

    def set_project_name(self, name: str) -> "CampaignBuilder":
        """Set project name."""
        self.campaign["ProjectName"] = name
        return self

    def set_visits(self, total: int, daily_limit: int = 3) -> "CampaignBuilder":
        """Set visit quotas."""
        self.campaign["numberOfVisits"] = str(total)
        self.campaign["doneVisits"] = validate_progress_string(0, total)
        self.campaign["DailyLimit"] = str(daily_limit)
        self.campaign["doneDailyVisits"] = validate_progress_string(0, 1)
        return self

    def set_geolocation(
        self, lat: float, lon: float, radius_miles: float = 1.0, count: int = 75
    ) -> "CampaignBuilder":
        """Set geolocation targeting."""
        self.campaign["strMiles"] = str(radius_miles)
        self.campaign["lstCustomGeolocations"] = generate_geolocations(
            lat, lon, radius_miles, count
        )
        return self

    def set_target_sites(self, sites: List[str]) -> "CampaignBuilder":
        """Set target URLs/sites."""
        self.campaign["lstSites"] = sites
        return self

    def set_keywords(self, keywords: List[str]) -> "CampaignBuilder":
        """Set action keywords."""
        self.campaign["Keywords"] = keywords
        self.campaign["UsedKeywords"] = []
        return self

    def set_timing(
        self,
        visit_min: int = 180,
        visit_max: int = 250,
        internal_min: int = 90,
        internal_max: int = 120,
        referral_min: int = 30,
        referral_max: int = 90,
        delay_min: int = 1300,
        delay_max: int = 2000,
    ) -> "CampaignBuilder":
        """Set timing ranges (in seconds)."""
        self.campaign["TimeOfVisitMin"] = str(visit_min)
        self.campaign["TimeOfVisitMax"] = str(visit_max)
        self.campaign["TimeOfInternalMin"] = str(internal_min)
        self.campaign["TimeOfInternalMax"] = str(internal_max)
        self.campaign["TimeOfReferrelMin"] = str(referral_min)
        self.campaign["TimeOfReferrelMax"] = str(referral_max)
        self.campaign["MinDelayAfterVisit"] = str(delay_min)
        self.campaign["MaxDelayAfterVisit"] = str(delay_max)
        return self

    def set_schedule(
        self, start_time: str = "10:00 AM", end_time: str = "09:00 PM"
    ) -> "CampaignBuilder":
        """Set operating hours."""
        self.campaign["strStartTime"] = start_time
        self.campaign["strEndTime"] = end_time
        return self

    def set_device(
        self, device_type: str = "Desktop", mobile_percentage: float = 0.0
    ) -> "CampaignBuilder":
        """Set device configuration."""
        self.campaign["DeviceType"] = device_type
        self.campaign["strNextDevice"] = device_type
        self.campaign["strMobileUseragentPecentage"] = str(mobile_percentage)
        return self

    def enable_gmb_interaction(self, enabled: bool = True) -> "CampaignBuilder":
        """Enable/disable GMB interactions."""
        self.campaign["UseGMBInteraction"] = enabled
        return self

    def enable_custom_proxy(
        self, enabled: bool = True, proxies: Optional[List[str]] = None
    ) -> "CampaignBuilder":
        """Enable custom proxy usage."""
        self.campaign["UseCustomProxy"] = enabled
        if proxies:
            self.campaign["lstCustomProxies"] = proxies
        return self

    def set_custom_field(self, field: str, value: Any) -> "CampaignBuilder":
        """Set any custom field value."""
        self.campaign[field] = value
        return self

    def build(self) -> Dict[str, Any]:
        """Build and return the campaign object."""
        # Auto-set TargetUrl if empty
        if not self.campaign["TargetUrl"]:
            campaign_type = self.campaign["Type"]

            if campaign_type == "DirectVisit" and self.campaign["Keywords"]:
                # DirectVisit: use first keyword (should be website URL)
                self.campaign["TargetUrl"] = self.campaign["Keywords"][0]
            elif self.campaign["lstSites"]:
                # Other types: use first site
                self.campaign["TargetUrl"] = self.campaign["lstSites"][0]
            elif self.campaign["Keywords"]:
                # Fallback: use first URL keyword
                url_keywords = [
                    k for k in self.campaign["Keywords"] if k.startswith("http")
                ]
                if url_keywords:
                    self.campaign["TargetUrl"] = url_keywords[0]

        # Auto-set TargetName if empty
        if not self.campaign["TargetName"]:
            self.campaign["TargetName"] = self.campaign["ProjectName"]

        return copy.deepcopy(self.campaign)


# ============================================================================
# CAMPAIGN MANAGER
# ============================================================================


class CampaignManager:
    """Manager for CTRBooster backup files."""

    def __init__(self):
        """Initialize empty campaign list."""
        self.campaigns: List[Dict[str, Any]] = []

    def load_from_file(self, filepath: str) -> int:
        """
        Load campaigns from backup file.

        Returns:
            Number of campaigns loaded
        """
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if not isinstance(data, list):
            raise ValueError("Backup file must contain a JSON array")

        self.campaigns = data
        return len(self.campaigns)

    def save_to_file(self, filepath: str, indent: int = 2) -> int:
        """
        Save campaigns to backup file.

        Returns:
            Number of campaigns saved
        """
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.campaigns, f, indent=indent)

        return len(self.campaigns)

    def add_campaign(self, campaign: Dict[str, Any]) -> str:
        """
        Add a campaign to the list.

        Returns:
            Campaign ID
        """
        self.campaigns.append(campaign)
        return campaign["id"]

    def remove_campaign(self, campaign_id: str) -> bool:
        """
        Remove a campaign by ID.

        Returns:
            True if removed, False if not found
        """
        for i, campaign in enumerate(self.campaigns):
            if campaign["id"] == campaign_id:
                del self.campaigns[i]
                return True
        return False

    def get_campaign(self, campaign_id: str) -> Optional[Dict[str, Any]]:
        """Get a campaign by ID."""
        for campaign in self.campaigns:
            if campaign["id"] == campaign_id:
                return campaign
        return None

    def update_campaign(self, campaign_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update a campaign's fields.

        Returns:
            True if updated, False if not found
        """
        campaign = self.get_campaign(campaign_id)
        if campaign:
            campaign.update(updates)
            return True
        return False

    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about loaded campaigns."""
        from collections import Counter

        types = Counter()
        total_visits = 0

        for campaign in self.campaigns:
            types[campaign.get("Type", "UNKNOWN")] += 1
            try:
                visits = int(campaign.get("numberOfVisits", "0"))
                total_visits += visits
            except ValueError:
                pass

        return {
            "total_campaigns": len(self.campaigns),
            "campaign_types": dict(types),
            "total_planned_visits": total_visits,
        }

    def filter_by_type(self, campaign_type: str) -> List[Dict[str, Any]]:
        """Get all campaigns of a specific type."""
        return [c for c in self.campaigns if c.get("Type") == campaign_type]

    def clear(self):
        """Clear all campaigns."""
        self.campaigns = []


# ============================================================================
# QUICK TEMPLATES
# ============================================================================


class QuickTemplates:
    """Pre-built campaign templates for common scenarios."""

    @staticmethod
    def gsearch_brand(
        project_name: str,
        lat: float,
        lon: float,
        search_keywords: List[str],
        visits: int = 1000,
    ) -> Dict[str, Any]:
        """GSearch campaign for brand searches."""
        return (
            CampaignBuilder("GSearch")
            .set_project_name(project_name)
            .set_geolocation(lat, lon, radius_miles=3.0, count=50)
            .set_keywords(search_keywords)
            .set_visits(visits, daily_limit=3)
            .set_timing(visit_min=180, visit_max=250)
            .build()
        )

    @staticmethod
    def gmap_local(
        project_name: str,
        lat: float,
        lon: float,
        gmb_urls: List[str],
        phone_number: Optional[str] = None,
        visits: int = 1000,
    ) -> Dict[str, Any]:
        """GMap campaign for local business."""
        keywords = []
        if phone_number:
            keywords.append(f"tel:{phone_number}")

        return (
            CampaignBuilder("GMap")
            .set_project_name(project_name)
            .set_geolocation(lat, lon, radius_miles=1.0, count=75)
            .set_target_sites(gmb_urls)
            .set_keywords(keywords)
            .set_visits(visits, daily_limit=3)
            .build()
        )

    @staticmethod
    def referal_visit(
        project_name: str,
        lat: float,
        lon: float,
        target_sites: List[str],
        action_keywords: List[str],
        visits: int = 100,
    ) -> Dict[str, Any]:
        """RefDVisit campaign for referral traffic."""
        return (
            CampaignBuilder("RefDVisit")
            .set_project_name(project_name)
            .set_geolocation(lat, lon, radius_miles=3.0, count=50)
            .set_target_sites(target_sites)
            .set_keywords(action_keywords)
            .set_visits(visits, daily_limit=2)
            .set_timing(
                visit_min=180,
                visit_max=250,
                referral_min=60,
                referral_max=120,
                delay_min=1800,
                delay_max=2400,
            )
            .build()
        )

    @staticmethod
    def direct_visit(
        project_name: str, website_url: str, visits: int = 100
    ) -> Dict[str, Any]:
        """DirectVisit campaign for direct website traffic."""
        return (
            CampaignBuilder("DirectVisit")
            .set_project_name(project_name)
            .set_keywords([website_url])
            .set_visits(visits, daily_limit=2)
            .set_custom_field("TargetUrl", website_url)
            .build()
        )


# ============================================================================
# CLI INTERFACE
# ============================================================================


def print_menu():
    """Print main menu."""
    print("\n" + "=" * 70)
    print("CTRBooster Campaign Manager")
    print("=" * 70)
    print("\n📋 MENU:")
    print("  1. Create new campaign")
    print("  2. Load backup file")
    print("  3. View campaigns")
    print("  4. Edit campaign")
    print("  5. Delete campaign")
    print("  6. Save backup file")
    print("  7. Statistics")
    print("  8. Batch create from template")
    print("  9. Exit")
    print()


def create_campaign_interactive() -> Dict[str, Any]:
    """Interactive campaign creation."""
    print("\n🎯 CREATE NEW CAMPAIGN")
    print("-" * 70)

    # Campaign type
    print("\nCampaign Types:")
    for i, ctype in enumerate(CAMPAIGN_TYPE_CONFIGS.keys(), 1):
        print(f"  {i}. {ctype}")

    types_list = list(CAMPAIGN_TYPE_CONFIGS.keys())
    while True:
        type_choice = input("\nSelect type (1-5): ").strip()
        try:
            idx = int(type_choice) - 1
            if 0 <= idx < len(types_list):
                campaign_type = types_list[idx]
                break
            print("Invalid selection. Please enter a number between 1 and 5.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    # Basic info
    project_name = input("Project name: ").strip()

    while True:
        visits_input = input("Total visits (default 1000): ").strip() or "1000"
        try:
            visits = int(visits_input)
            if visits > 0:
                break
            print("Visits must be a positive number.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    while True:
        daily_input = input("Daily limit (default 3): ").strip() or "3"
        try:
            daily_limit = int(daily_input)
            if daily_limit > 0:
                break
            print("Daily limit must be a positive number.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    # Geolocation
    print("\n📍 Geolocation Settings:")

    while True:
        lat_input = input("  Latitude: ").strip()
        try:
            lat = float(lat_input)
            if -90 <= lat <= 90:
                break
            print("Latitude must be between -90 and 90.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    while True:
        lon_input = input("  Longitude: ").strip()
        try:
            lon = float(lon_input)
            if -180 <= lon <= 180:
                break
            print("Longitude must be between -180 and 180.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    while True:
        radius_input = input("  Radius in miles (default 1.0): ").strip() or "1.0"
        try:
            radius = float(radius_input)
            if radius > 0:
                break
            print("Radius must be a positive number.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    while True:
        geo_input = input("  Number of geo points (default 75): ").strip() or "75"
        try:
            geo_count = int(geo_input)
            if geo_count > 0:
                break
            print("Number of geo points must be a positive number.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    # URLs/Keywords
    print("\n🔗 Target Sites (comma-separated, or press Enter to skip):")
    sites_input = input("  Sites: ").strip()
    sites = [s.strip() for s in sites_input.split(",")] if sites_input else []

    print("\n🔑 Keywords (comma-separated, or press Enter to skip):")
    keywords_input = input("  Keywords: ").strip()
    keywords = [k.strip() for k in keywords_input.split(",")] if keywords_input else []

    # Build campaign
    builder = (
        CampaignBuilder(campaign_type)
        .set_project_name(project_name)
        .set_visits(visits, daily_limit)
        .set_geolocation(lat, lon, radius, geo_count)
        .set_target_sites(sites)
        .set_keywords(keywords)
    )

    return builder.build()


def main():
    """Main CLI loop."""
    manager = CampaignManager()

    while True:
        print_menu()
        choice = input("Select option (1-9): ").strip()

        if choice == "1":
            # Create campaign
            try:
                campaign = create_campaign_interactive()
                campaign_id = manager.add_campaign(campaign)
                print(f"\n✅ Campaign created! ID: {campaign_id}")
            except Exception as e:
                print(f"\n❌ Error: {e}")

        elif choice == "2":
            # Load file
            filepath = input("\nEnter backup file path: ").strip()
            try:
                count = manager.load_from_file(filepath)
                print(f"\n✅ Loaded {count} campaigns from {filepath}")
            except Exception as e:
                print(f"\n❌ Error: {e}")

        elif choice == "3":
            # View campaigns
            print(f"\n📊 Total Campaigns: {len(manager.campaigns)}")
            for i, campaign in enumerate(manager.campaigns[:10], 1):
                print(
                    f"  {i}. [{campaign['Type']}] {campaign['ProjectName']} (ID: {campaign['id']})"
                )
            if len(manager.campaigns) > 10:
                print(f"  ... and {len(manager.campaigns) - 10} more")

        elif choice == "4":
            # Edit campaign
            campaign_id = input("\nEnter campaign ID: ").strip()
            campaign = manager.get_campaign(campaign_id)
            if campaign:
                print(f"\nEditing: {campaign['ProjectName']}")
                field = input("Field to edit: ").strip()
                value = input("New value: ").strip()
                # Try to convert to appropriate type
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False
                elif value.isdigit():
                    value = int(value)
                manager.update_campaign(campaign_id, {field: value})
                print("\n✅ Campaign updated!")
            else:
                print("\n❌ Campaign not found")

        elif choice == "5":
            # Delete campaign
            campaign_id = input("\nEnter campaign ID: ").strip()
            if manager.remove_campaign(campaign_id):
                print("\n✅ Campaign deleted!")
            else:
                print("\n❌ Campaign not found")

        elif choice == "6":
            # Save file
            filepath = input("\nEnter output file path: ").strip()
            try:
                count = manager.save_to_file(filepath)
                print(f"\n✅ Saved {count} campaigns to {filepath}")
            except Exception as e:
                print(f"\n❌ Error: {e}")

        elif choice == "7":
            # Statistics
            stats = manager.get_statistics()
            print("\n📊 STATISTICS:")
            print(f"  Total Campaigns: {stats['total_campaigns']}")
            print(f"  Total Planned Visits: {stats['total_planned_visits']:,}")
            print("\n  Campaign Types:")
            for ctype, count in stats["campaign_types"].items():
                print(f"    • {ctype}: {count}")

        elif choice == "8":
            # Batch create
            print("\n🚀 BATCH CREATE FROM TEMPLATE")
            print("  1. GSearch Brand Campaign")
            print("  2. GMap Local Business")
            print("  3. RefDVisit Referral")
            print("  4. DirectVisit Website")

            template_choice = input("\nSelect template (1-4): ").strip()
            count = int(input("How many to create: ").strip())

            for i in range(count):
                if template_choice == "1":
                    campaign = QuickTemplates.gsearch_brand(
                        f"Campaign {i + 1}",
                        40.7128,
                        -74.0060,  # NYC
                        ["brand keyword"],
                    )
                elif template_choice == "2":
                    campaign = QuickTemplates.gmap_local(
                        f"Campaign {i + 1}",
                        40.7128,
                        -74.0060,
                        ["https://maps.google.com/..."],
                    )
                elif template_choice == "3":
                    campaign = QuickTemplates.referal_visit(
                        f"Campaign {i + 1}",
                        40.7128,
                        -74.0060,
                        ["https://example.com"],
                        ["tel:+1234567890"],
                    )
                else:
                    campaign = QuickTemplates.direct_visit(
                        f"Campaign {i + 1}", "https://example.com"
                    )
                manager.add_campaign(campaign)

            print(f"\n✅ Created {count} campaigns!")

        elif choice == "9":
            # Exit
            print("\n👋 Goodbye!")
            break

        else:
            print("\n❌ Invalid option")


if __name__ == "__main__":
    main()
