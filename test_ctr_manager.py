import os
import json
import time
from playwright.sync_api import sync_playwright

def test_workflow():
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
        
        # Click Edit
        print("Clicking Edit...")
        page.locator("#tableBody tr .edit-btn").first.click()
        page.wait_for_selector("#modal", state="visible")
        
        # Modify variables across tabs
        print("Modifying variables...")
        
        # Get groups mapping
        groups = page.evaluate("SCHEMA_GROUPS")
        
        for tab_id, keys in groups.items():
            print(f"Switching to {tab_id} tab...")
            page.click(f".tab[data-tab='{tab_id}']")
            
            for key in keys:
                selector_input = f'#projectForm input[name="{key}"]'
                selector_select = f'#projectForm select[name="{key}"]'
                selector_textarea = f'#projectForm textarea[name="{key}"]'
                
                val = f"TEST_{key}"
                if key == "id": continue # Keep same ID
                if key == "ProjectName": val = "FULLY_REVISED_PROJECT"
                
                if page.locator(selector_input).count() > 0:
                    page.fill(selector_input, val)
                elif page.locator(selector_select).count() > 0:
                    page.select_option(selector_select, "true")
                elif page.locator(selector_textarea).count() > 0:
                    page.fill(selector_textarea, "LINE1\nLINE2")
        
        # Save
        page.click("#saveBtn")
        page.wait_for_selector("#modal", state="hidden")
        print("Saved changes.")
        
        # Export
        with page.expect_download() as download_info:
            page.click("#exportBtn")
        download = download_info.value
        path = os.path.join(current_dir, "exported_full_test.json")
        download.save_as(path)
        print(f"Exported to {path}")
        
        # Verify
        with open(path, 'r') as f:
            exported_data = json.load(f)
            # Find the one we modified (it should be in the exported list)
            project = next((p for p in exported_data if p.get("ProjectName") == "FULLY_REVISED_PROJECT"), None)
            
            if project and project["ProjectName"] == "FULLY_REVISED_PROJECT" and project["UseGeolocation"] == True:
                print("Export verification: SUCCESS")
            else:
                print("Export verification: FAILED")

        # Re-import and verify UI
        page.reload()
        page.set_input_files("#fileInput", path)
        page.wait_for_selector("#tableBody tr")
        
        final_text = page.locator("#tableBody tr").first.inner_text()
        if "FULLY_REVISED_PROJECT" in final_text:
            print("Final Re-import UI Verification: SUCCESS")
        else:
            print("Final Re-import UI Verification: FAILED")
            
        browser.close()

if __name__ == "__main__":
    test_workflow()
