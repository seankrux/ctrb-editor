import os
import json
import time
from playwright.sync_api import sync_playwright

def run_user_workflow_simulation():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Monitor for errors
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        current_dir = os.getcwd()
        file_url = f"file://{current_dir}/ctr-manager.html"
        
        print("--- STEP 1: INITIAL LOAD ---")
        page.goto(file_url)
        print("Page loaded.")

        print("\n--- STEP 2: IMPORTING BACKUP ---")
        # Using one of the real backup files
        input_file = os.path.join(current_dir, "CTR VPS 1 -126.184 - 1_24_25.json")
        page.set_input_files("#fileInput", input_file)
        page.wait_for_selector("#tableBody tr")
        
        campaign_count = page.locator("#tableBody tr").count()
        print(f"Imported {campaign_count} campaigns.")

        print("\n--- STEP 3: EDITING CAMPAIGN ---")
        # Edit the first project
        first_row = page.locator("#tableBody tr").first
        original_name = first_row.locator("td:nth-child(2) div").first.inner_text()
        print(f"Editing original campaign: '{original_name}'")
        
        first_row.locator(".edit-btn").click()
        page.wait_for_selector("#modal", state="visible")

        # 1. Targeting Tab
        print("  - Modifying Targeting details...")
        page.click(".tab[data-tab='targeting']")
        page.fill("#field_ProjectName", "WORKFLOW_VERIFIED_CAMPAIGN")
        page.fill("#field_TargetUrl", "https://verified-test.com")
        
        # 2. Behavior Tab
        print("  - Modifying Behavior modeling...")
        page.click(".tab[data-tab='behavior']")
        page.fill("#field_numberOfVisits", "5000")
        page.fill("#field_TimeOfVisitMin", "180")
        
        # 3. Geo Tab
        print("  - Modifying Geo settings...")
        page.click(".tab[data-tab='geo']")
        page.select_option("#field_UseGeolocation", "true")
        page.fill("#field_lstCustomGeolocations", "40.7128,-74.0060\n34.0522,-118.2437")

        print("Saving changes...")
        page.click("#saveBtn")
        page.wait_for_selector("#modal", state="hidden")

        print("\n--- STEP 4: EXPORTING CHANGES ---")
        with page.expect_download() as download_info:
            page.click("#exportBtn")
        download = download_info.value
        export_path = os.path.join(current_dir, "round_trip_verified.json")
        download.save_as(export_path)
        print(f"Exported modified data to {export_path}")

        print("\n--- STEP 5: RE-IMPORTING & VERIFYING ---")
        # Refresh page to clear memory
        page.reload()
        print("Page reloaded (clean slate).")
        
        # Re-import the exported file
        page.set_input_files("#fileInput", export_path)
        page.wait_for_selector("#tableBody tr")
        
        # Verify changes in UI
        final_row = page.locator("#tableBody tr").first
        final_name = final_row.locator("td:nth-child(2) div").first.inner_text()
        final_url = final_row.locator("td:nth-child(4) div").first.inner_text()
        
        print(f"Re-imported campaign name: '{final_name}'")
        
        # Deep check values in modal
        final_row.locator(".edit-btn").click()
        page.wait_for_selector("#modal", state="visible")
        
        page.click(".tab[data-tab='behavior']")
        visit_val = page.input_value("#field_numberOfVisits")
        
        page.click(".tab[data-tab='geo']")
        geo_val = page.input_value("#field_lstCustomGeolocations")
        
        success = True
        if final_name != "WORKFLOW_VERIFIED_CAMPAIGN":
            print("FAILURE: Campaign name mismatch!")
            success = False
        if final_url != "https://verified-test.com":
            print("FAILURE: Target URL mismatch!")
            success = False
        if visit_val != "5000":
            print("FAILURE: Visit goal mismatch!")
            success = False
        if "40.7128" not in geo_val:
            print("FAILURE: Geo data mismatch!")
            success = False

        if success:
            print("\n✅ ROUND-TRIP SIMULATION COMPLETED SUCCESSFULLY!")
            print("All modified fields persisted through Export -> Reload -> Import.")
        else:
            print("\n❌ ROUND-TRIP SIMULATION FAILED.")

        browser.close()

if __name__ == "__main__":
    run_user_workflow_simulation()
