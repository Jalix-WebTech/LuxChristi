# Lux Christi multi-page structure

The original single-page sections have been moved into seven standalone HTML documents. Shared navigation, theme controls, footer, CSS, and JavaScript modules are reused. Each page loads the shared application entry point; page-specific controllers initialize only when their required elements exist.

Run through a local static server (VS Code Live Server or `python -m http.server 8000`). Do not open pages using `file://` because the project uses native JavaScript modules.
