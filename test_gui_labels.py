import os
import json
from playwright.sync_api import sync_playwright

def test_gui_comprehensive():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))
        # page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        current_dir = os.getcwd()
        file_url = f"file://{current_dir}/ctr-manager.html"
        page.goto(file_url)
        
        # Open modal
        print("Opening New Campaign modal...")
        page.click("button:has-text('New Campaign')")
        page.wait_for_selector("#modal", state="visible")
        
        # Get mapping from page
        label_map = page.evaluate("LABEL_MAP")
        schema_groups = page.evaluate("SCHEMA_GROUPS")
        
        all_passed = True
        
        for tab_id, keys in schema_groups.items():
            print(f"Testing tab: {tab_id}")
            tab_selector = f".tab[data-tab='{tab_id}']"
            page.click(tab_selector)
            
            # Check if tab content is visible
            content_selector = f"#tab-{tab_id}"
            if not page.is_visible(content_selector):
                print(f"FAILURE: Tab content {content_selector} is not visible.")
                all_passed = False
                continue
                
            for key in keys:
                expected_label = label_map.get(key)
                input_id = f"field_{key}"
                
                # Check label text
                label_selector = f"label[for='{input_id}']"
                actual_label = page.inner_text(label_selector).strip()
                
                if actual_label != expected_label:
                    print(f"LABEL MISMATCH for key '{key}': Expected '{expected_label}', got '{actual_label}'")
                    all_passed = False
                
                # Check input exists
                if page.locator(f"#{input_id}").count() == 0:
                    print(f"INPUT MISSING for key '{key}': ID '#{input_id}' not found.")
                    all_passed = False
                elif not page.is_visible(f"#{input_id}"):
                    print(f"INPUT HIDDEN for key '{key}': ID '#{input_id}' is not visible in tab '{tab_id}'.")
                    all_passed = False

        if all_passed:
            print("GUI COMPREHENSIVE TEST: SUCCESS (All labels and inputs verified across tabs)")
        else:
            print("GUI COMPREHENSIVE TEST: FAILED")
            
        browser.close()

if __name__ == "__main__":
    test_gui_comprehensive()
