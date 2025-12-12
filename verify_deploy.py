from playwright.sync_api import sync_playwright

def verify_deploy():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to local deploy simulation...")
            # Accessing via the subpath to simulate GitHub Pages: user.github.io/repo-name/
            page.goto("http://localhost:8000/copy-of-lins-agroindustrial-report/")

            print("Waiting for root element...")
            page.wait_for_selector("#root")

            print("Waiting for content to appear (checking for 'Relatório de Sustentabilidade')...")
            # If the JS loads correctly, this text should appear.
            # If it's white screen, this will timeout.
            page.wait_for_selector("text=Relatório de Sustentabilidade", timeout=5000)

            print("Content found. Taking screenshot.")
            page.screenshot(path="deploy_verification.png")
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="deploy_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_deploy()
