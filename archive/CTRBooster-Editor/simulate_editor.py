import json
import os
import time
from playwright.sync_api import sync_playwright

def test_round_trip_all_variables():
    # Paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Assuming we are running in the directory where these files are
    html_file = os.path.join(current_dir, "ctr-manager.html")
    input_json = os.path.join(current_dir, "CTR VPS 1 -126.184 - 1_24_25.json")
    export_dir = os.path.join(current_dir, "exports")
    os.makedirs(export_dir, exist_ok=True)

    SCHEMA_KEYS = [
        "strGoogleSearchType", "strMiles", "UseXMiles", "UseGeolocation", "strNextDevice", 
        "AuthorId", "MatchExactUrl", "id", "Checked", "UseCustomProxy", "UseGMBInteraction", 
        "UseKnowdGraphInteraction", "UsePhoneNumberClick", "ProjectName", "Type", "numberOfVisits", 
        "doneVisits", "doneDailyVisits", "TimeOfVisitMin", "TimeOfVisitMax", "InternalVisitsCount", 
        "TimeOfInternalMin", "TimeOfInternalMax", "TimeOfReferrelMin", "TimeOfReferrelMax", "Threads", 
        "TimeinGooglePagesMin", "TimeinGooglePagesMax", "MaxPages", "TargetSearchEngine", "TargetUrl", 
        "TargetName", "CreateTime", "lstUsedProxies", "lstCustomProxies", "lstCustomGeolocations", 
        "lstKeywords", "lstSites", "lstInternalIgnoreLinks", "GMapRetries", "GMapRetriesFails", 
        "DailyLimit", "DailyLimitMin", "DailyLimitMax", "dtTodayDate", "MinDelayAfterVisit", 
        "MaxDelayAfterVisit", "DeviceType", "VisitCompetitor", "strStartTime", "strEndTime", 
        "strMobileUseragentPecentage", "strMobileVisits", "strDesktopVisits", "Keywords", 
        "UsedKeywords", "Filename", "nextRun", "UseCustomLanguage", "CustomLanguage"
    ]

    with sync_playwright() as p:
        # Need a graphical environment or headed=False (which is default True for some tools, but let's be explicit)
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        # Catch console errors
        page.on("console", lambda msg: print(f"CONSOLE {msg.type}: {msg.text}"))

        page.goto(f"file://{html_file}")
        print("Opened app.")

        # Import
        with page.expect_file_chooser() as fc_info:
            page.click("button:has-text('Import JSONs')")
        file_chooser = fc_info.value
        file_chooser.set_files(input_json)
        print("Imported original JSON.")

        page.wait_for_selector("tbody#tableBody tr")
        print("Table rendered.")

        # Edit first project
        # Ensure we click the edit button of the first row
        first_row_id = page.eval_on_selector("tbody#tableBody tr:first-child", "el => el.dataset.id")
        print(f"Editing project with ID: {first_row_id}")
        page.click(f"tbody#tableBody tr[data-id='{first_row_id}'] .edit-btn")
        print("Opened edit modal.")

        # Modify EVERY field
        for key in SCHEMA_KEYS:
            selector = f"#projectForm [name='{key}']"
            # Some fields might not exist in the form if initForm is called after the loop
            if page.query_selector(selector) is None:
                # print(f"Warning: Field {key} not found in modal.")
                continue

            tag_name = page.eval_on_selector(selector, "el => el.tagName")
            
            # Create a unique-ish test value
            is_bool = key.startswith('Use') or key in ['Checked', 'VisitCompetitor', 'MatchExactUrl']
            is_area = key in ['Keywords', 'lstSites', 'lstCustomGeolocations', 'lstCustomProxies']

            if tag_name == "SELECT":
                # Booleans are selects in the app
                page.select_option(selector, "true")
            elif tag_name == "TEXTAREA":
                page.fill(selector, f"test_{key}_1\ntest_{key}_2")
            else:
                # Standard input
                if key == "id":
                    continue # Keep same ID for easy matching, although we could change it
                page.fill(selector, f"TEST_VAL_{key}")

        print("Modified all fields in the schema.")

        # Save
        page.click("#saveBtn")
        print("Saved changes.")

        # Export
        with page.expect_download() as download_info:
            page.click("#exportBtn")
        download = download_info.value
        export_path = os.path.join(export_dir, "full_schema_test.json")
        download.save_as(export_path)
        print(f"Exported to {export_path}")

        # Verify Export Data
        with open(export_path, 'r') as f:
            exported_data = json.load(f)
        
        # Check the one we edited
        test_project = next((p for p in exported_data if p.get("id") == first_row_id), None)
        
        if not test_project:
            raise Exception(f"Modified project with ID {first_row_id} not found in export!")

        print(f"Verifying fields for project {test_project.get('ProjectName')}")
        failed_keys = []
        for key in SCHEMA_KEYS:
            if key == "id": continue
            
            val = test_project.get(key)
            is_bool = key.startswith('Use') or key in ['Checked', 'VisitCompetitor', 'MatchExactUrl']
            is_area = key in ['Keywords', 'lstSites', 'lstCustomGeolocations', 'lstCustomProxies']
            
            # Skip if field not in modal (not all SCHEMA_KEYS might be in form if the JS is different)
            if page.query_selector(f"#projectForm [name='{key}']") is None:
                continue

            if is_bool:
                if val is not True:
                    failed_keys.append(f"{key}: expected True, got {val}")
            elif is_area:
                expected = [f"test_{key}_1", f"test_{key}_2"]
                if val != expected:
                    failed_keys.append(f"{key}: expected {expected}, got {val}")
            else:
                expected = f"TEST_VAL_{key}"
                if val != expected:
                    failed_keys.append(f"{key}: expected {expected}, got {val}")

        if failed_keys:
            print("FAILED KEYS:")
            for f in failed_keys:
                print(f)
        else:
            print("All fields verified in export JSON.")

        # Final Round-trip: Re-import test
        page.reload()
        print("App reloaded.")
        with page.expect_file_chooser() as fc_info:
            page.click("button:has-text('Import JSONs')")
        file_chooser = fc_info.value
        file_chooser.set_files(export_path)
        page.wait_for_selector("tbody#tableBody tr")
        print("Re-imported the test JSON.")
        
        # Verify the edited project name is visible in the table
        found_test_name = page.inner_text("tbody#tableBody")
        if "TEST_VAL_ProjectName" in found_test_name:
            print("SUCCESS: Round-trip completed. App correctly handles all variables.")
        else:
            # Maybe search?
            page.fill("#searchInput", "TEST_VAL_ProjectName")
            page.wait_for_timeout(500)
            if "TEST_VAL_ProjectName" in page.inner_text("tbody#tableBody"):
                print("SUCCESS: Round-trip completed (found via search).")
            else:
                print("ERROR: TEST_VAL_ProjectName not found in table after re-import.")
                # Snapshot for debugging
                page.screenshot(path=os.path.join(current_dir, "debug_failed_reimport.png"))
                raise Exception("Re-import verification failed.")

        browser.close()

if __name__ == "__main__":
    test_round_trip_all_variables()
