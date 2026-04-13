# Tailwind Bin

A lightweight, self-hosted paste service for sharing and previewing Tailwind snippets instantly in the browser.

## Features

### Creating and sharing pastes
- **Instant preview** see your Tailwind HTML rendered live as soon as you save it, no setup needed
- **File upload** drag and drop an HTML file onto the page, or click to pick one from your computer
- **Paste editor** prefer typing? Just paste your code directly into the built-in editor
- **Shareable links** every paste gets its own short link you can send to anyone
- **View the source** see the original HTML code behind any paste
- **Open in a new tab** pop the preview out into its own full-screen tab
- **Paste info** each paste shows how many lines it has, how large the file is, and how long until it expires
- **Automatic expiry** pastes are deleted after 1 year so old ones don't pile up forever
- **Self-cleaning** the app quietly removes expired pastes in the background so you don't have to

### Admin
- **Admin area** log in at `/admin` with a username and password to manage all pastes in one place
- **Paste list** see every paste at a glance with key details, browsable across multiple pages
- **Delete pastes** remove any paste right from the list; a quick two-click confirmation stops accidental deletions
- **Stay logged in** your admin session is remembered until you sign out
- **Brute-force protection** too many wrong password attempts will temporarily lock out the login page
