# Restaurant Menu App

This is a simple Node.js and Express application for managing and displaying a restaurant menu from a PDF file.

## Features

-   Admin panel to upload/delete the menu PDF.
-   Password-protected admin access.
-   A public page to view the menu.
-   Custom PDF viewer.

## Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

-   Admin Login: `/login` (password is hardcoded in `app.js`)
-   Admin Panel: `/admin`
-   Menu View: `/menu`
