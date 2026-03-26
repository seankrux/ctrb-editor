# CTR Booster: Campaign Manager Pro

A sophisticated, portable web application designed to manage, edit, and bulk-process campaign backup files for the CTR Booster automation engine.

## 🚀 Key Features

-   **Modular Configuration**: 60+ technical variables organized into 6 semantic tabs based on SOP phases.
-   **Mass Update (Bulk Edit)**: Update specific parameters across hundreds of campaigns simultaneously without overwriting other data.
-   **Visual Dashboards**: Real-time visit progress bars and method-specific badges (GMB, Search, Referrer).
-   **Data Integrity**: Full round-trip persistence verified through automated testing (Import -> Edit -> Export -> Re-import).
-   **High Performance**: Optimized for datasets exceeding 1,000+ campaigns using Vanilla JS and efficient DOM patterns.

## 📂 Configuration Tabs (SOP Phases)

1.  **🎯 Targeting**: Core campaign identity, destination URL, and search engine selection.
2.  **🧠 Behavior**: Modeling human interaction including stay durations and internal page navigation.
3.  **🔍 Search**: Keyword management and SERP interaction logic.
4.  **🛡️ Evasion**: Anonymity settings, proxy rotation, and device emulation percentages.
5.  **📍 Geo**: GPS coordinate spoofing and variable radius calibration.
6.  **⚙️ System**: Technical IDs, retry counters, and internal backup metadata.

## 🛠️ Technical Architecture

-   **Frontend**: HTML5, CSS3 (Variables + Flexbox/Grid), Vanilla ES6+.
-   **State Management**: Encapsulated `CTRManager.State` object.
-   **Namespace**: All logic is contained within the `CTRManager` namespace to prevent conflicts.
-   **Dependency-Free**: Requires no installation or internet connection; runs directly from any modern browser.

## 🧪 Testing Suite

The application includes a comprehensive Python/Playwright test suite:
-   `test_user_workflow.py`: End-to-end round-trip verification.
-   `test_bulk_edit.py`: Validates mass parameter updates.
-   `test_gui_labels.py`: Audits UI labels and visibility across tabs.

## 📖 Usage Instructions

1.  Open `ctr-manager.html` in any web browser.
2.  Click **"Import Backups"** and select one or more `.json` files from your CTR Booster backups.
3.  Use the **Search Bar** to find specific campaigns by name, ID, or URL.
4.  To edit a single campaign, click **"Edit"** on the right side of the row.
5.  To update multiple campaigns:
    -   Select campaigns using the checkboxes.
    -   Click **"Bulk Edit"**.
    -   Modify only the fields you wish to change (empty fields will be ignored).
    -   Click **"Commit Changes"**.
6.  Click **"Export Selected"** (or Export Data) to save your changes back to a compatible JSON file.
