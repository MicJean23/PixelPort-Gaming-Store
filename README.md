# PixelPort Gaming Store

Fictional online store for the college final project **Web Publishing and Digital Advertising** (Option B: Create a Fictional Company).
Tagline: *Play more. Spend less. Game on.*

Group: Jean Venzon, Jorlyn Pangilinan, Ivan Bacani

## Run it on Windows with VS Code

1. Install **Node.js (LTS)** from https://nodejs.org. Restart VS Code afterwards.
2. In VS Code choose **File > Open Folder** and open this folder (the one that contains `server.js`).
3. Open the terminal with **Terminal > New Terminal**.
4. Check Node is installed: `node -v`
5. Start the site: `npm start` (no `npm install` needed, there are no dependencies).
6. Open **http://localhost:3000** in your browser. Stop the server with `Ctrl + C`.

Open the site through `http://localhost:3000`, not by double-clicking the HTML files, or the product data and contact form will not work.

## Folder guide

| Path | What it is |
|---|---|
| `server.js` | Node.js server: serves pages, `GET /api/games`, `GET /api/customers`, `POST /api/contact` |
| `public/*.html` | Pages: index, features, games, contact, customers (data demo), campaign |
| `public/css/style.css` | All styling. Colors are variables at the top (`:root`) |
| `public/js/` | `shop.js` (shared product code), `home.js`, `games.js`, `contact.js`, `data.js`, `main.js` (menu) |
| `public/images/` | Local images and SVG logo/covers |
| `data/games.json` | Product catalog (edit prices and descriptions here) |
| `data/customers.json` | Fictional customers |
| `data/inquiries.json` | Created automatically when someone sends the contact form. Private: not served by the website and ignored by Git |

## How the main parts work

- **Discount:** each game has `discountPercent` in `games.json`. `salePrice()` in `public/js/shop.js` calculates the offer price (749 with 20% off = 599.20). Accessories and Party Protocol have `0`.
- **Contact form:** checked in the browser (`contact.js`) and again on the server (`server.js`). The success message shows only after the server saved the inquiry.
- **Product details:** "View details" opens a window; "Send inquiry" goes to `contact.html?product=Name`, which fills the subject.

## Notes

- All products, prices, customers and the support email are fictional.
- `hero.jpg`, `gaming-controller.jpg`, `gaming-keyboard.jpg`, `retro-controller.jpg`, `arcade-joystick.jpg` and `neon-controller.jpg` are images supplied by the group. The About-section controller is cropped from the group's email design. The four game covers are simple SVG illustrations of fictional games, and the pixel icons, divider and grid in `public/images/elements/` are SVG elements made for this project.
- The Campaign page shows only the group's original email design (`public/images/email-design.png`). Its button area links to the 20% off games.
- No email is sent and no payments are made.
