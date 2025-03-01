# Next.js Auth Pages

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

## Installation

Before running the project, install the necessary dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Required Dependencies

Run the following commands to install all required dependencies:

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
npm install next react react-dom
npm install tailwindcss postcss autoprefixer
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
npm install framer-motion
npm install typescript @types/react @types/node --save-dev
```

---

## Folder Structure

```
/my-app
  ├── /app
  ├── /components
  ├── /public
  ├── /styles
  ├── .gitignore
  ├── package.json
  ├── tailwind.config.js
  ├── tsconfig.json
  ├── README.md
```

---

## Environment Variables

If your project requires environment variables, create a `.env.local` file and add the necessary configurations:

```
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
NEXTAUTH_SECRET=your_secret_key
```

---

## Useful Commands

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run production build:

```bash
npm run start
```

Lint and check for errors:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
