import os
import json
import time
from playwright.sync_api import sync_playwright

def test_bulk_edit():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        current_dir = os.getcwd()
        file_url = f"file://{current_dir}/ctr-manager.html"
        page.goto(file_url)
        page.wait_for_load_state('networkidle')
        
        print("Page loaded. Importing file...")
        input_file = os.path.join(current_dir, "ctrb_backup_1771014701423.json")
        page.set_input_files("#fileInput", input_file)
        
        page.wait_for_selector("#tableBody tr", timeout=10000)
        
        # Select all
        print("Selecting all projects...")
        page.click("#selectAll")
        
        # Verify Bulk Edit button is enabled
        bulk_edit_btn = page.locator("#bulkEditBtn")
        if bulk_edit_btn.is_disabled():
            print("FAILURE: Bulk Edit button should be enabled after selection.")
            browser.close()
            return

        print("Clicking Bulk Edit...")
        bulk_edit_btn.click()
        
        # Check if modal opened
        if not page.is_visible("#modal"):
            print("FAILURE: Bulk Edit modal did not open.")
            browser.close()
            return
            
        print("Bulk Edit modal opened. Switching to System tab...")
        # Threads is in the 'advanced' (System) tab
        page.click(".tab[data-tab='advanced']")
        
        print("Modifying threads...")
        # Let's say we want to change 'Threads' to 10 for all selected items
        page.fill("#projectForm [name='Threads']", "10")
        
        # Save
        print("Saving bulk changes...")
        page.click("#saveBtn")
        page.wait_for_selector("#modal", state="hidden")
        
        # Export and verify
        print("Exporting to verify bulk changes...")
        with page.expect_download() as download_info:
            page.click("#exportBtn")
        download = download_info.value
        path = os.path.join(current_dir, "bulk_exported_test.json")
        download.save_as(path)
        
        with open(path, 'r') as f:
            exported_data = json.load(f)
            all_updated = all(p.get("Threads") == "10" for p in exported_data)
            if all_updated:
                print("Bulk Edit verification: SUCCESS")
            else:
                # Find which one failed
                for i, p in enumerate(exported_data):
                    if p.get("Threads") != "10":
                        print(f"Project {i} (ID: {p.get('id')}) failed to update. Threads: {p.get('Threads')}")
                print("Bulk Edit verification: FAILED")
            
        browser.close()

if __name__ == "__main__":
    test_bulk_edit()
