import asyncio
from playwright.async_api import async_playwright


async def scrape_program_page(url: str) -> str:
    """Scrape program page content using Playwright. Returns raw text."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        try:
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2000)

            # Remove nav, footer, scripts to reduce noise
            await page.evaluate("""
                ['nav', 'footer', 'header', 'script', 'style', '.breadcrumb',
                 '#menu', '.menu', '.sidebar', '.social-links'].forEach(sel => {
                    document.querySelectorAll(sel).forEach(el => el.remove());
                });
            """)

            text = await page.evaluate("document.body.innerText")
            # Normalize whitespace
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            return "\n".join(lines)
        finally:
            await browser.close()


def scrape_sync(url: str) -> str:
    """Synchronous wrapper for scrape_program_page."""
    return asyncio.run(scrape_program_page(url))
