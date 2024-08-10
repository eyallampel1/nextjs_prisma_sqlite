This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Prisma setup

-  `npm install prisma`
-  `npx prisma init --datasource-provider sqlite `

**Output** : 
```bash
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.
4. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

More information in our documentation:
https://pris.ly/d/getting-started

```
-  Go to `prisma/schema.prisma` and update the schema (add model at the end of the file ) for example : 
```prisma
model Snippet {
  id        Int      @id @default(autoincrement())
  title     String
  code      String
  language  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
-  `npx prisma migrate dev` (Enter the name of the migration):
   **Output** :
```bash
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

✔ Enter a name for the new migration: … add snippet
Applying migration `20240810054733_add_snippet`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240810054733_add_snippet/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

✔ Generated Prisma Client (v5.18.0) to ./node_modules/.pnpm/@prisma+client@5.18.0_prisma@5.18.0/node_modules/@prisma/client in 38ms


```

- Prisma will generate your db in the root directory with the name `dev.db` and also generate the prisma client in the `node_modules` directory.
- Now you need to add a prisma client to access the database from the frontend (One time only in a project).
  Create a file `prisma/db.js` and add the following code:
```javascript
import {PrismaClient} from '@prisma/client';

export const db = new PrismaClient();
```
- Now you can access the database from the frontend by importing the `db` object from `prisma/db.js` file , this db object will allow us to add / remove / change data inside our database.
- Lets say we want to add a snippet to the database, we can do it like this:
```javascript
db.snippet.create({
  data: {
    title: 'Hello World',
    code: 'console.log("Hello World")',
    language: 'javascript'
    }
});
```
- Make sure the db.**name**.create is **exactly** the same as the model name in the schema in our example its Snippet .
- In our frontend we will create a form to add the snippet to the database.
```jsx
export default function Home() {

    async function handleSubmit(formData) {
        //this is a server action !
        'use server';
        //check user input
        const title = formData.get('title') ;
        const code = formData.get('code');
        const language = formData.get('language');
        console.log("title is: "+title,"code is: "+ code,"lang is: "+ language);
    }

    return (
        <form action={handleSubmit}>
            <div className={"m-3 p-3 border border-black flex flex-col space-y-4"}>
                <div className={"flex items-center space-x-2"}>
                    <div className={"text-3xl"}>Title: </div>
                    <input className={"border border-black flex-grow"} name="title" placeholder="snippet title"/>
                </div>
                <div className={"flex items-center space-x-2"}>
                    <div className={"text-3xl"}>Code: </div>
                    <textarea className={"border border-black flex-grow h-40"} name="code" placeholder="Code" />
                </div>
                <div className={"flex items-center space-x-2"}>
                    <div className={"text-3xl"}>Language: </div>
                    <input className={"border border-black flex-grow"} name="language" placeholder="language" />
                </div>
                <button className={"bg-blue-300 hover:bg-blue-100 rounded"} type="submit">Add snippet</button>
            </div>
        </form>
    );
}
```
- `npx prisma generate` to generate the prisma client.