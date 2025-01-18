# book_store

this is a simple book store web app that can do the following :

- display items (books)
- have a cart
- generate a pdf invoice and download it

# run the app

First, run the server:

```bash
npm install
```

then you shuold create a `.env` file in the app folder.

the `.env` should have a variable LOGO_LINK, which is for the logo link you can give it at first "http://localhost:3000/image.png"

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
