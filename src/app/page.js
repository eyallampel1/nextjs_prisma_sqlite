import { db } from '@/db';
export default function Home() {


    async function handleSubmit(formData) {
        //this is a server action !
        'use server';

        //check user input
        const title = formData.get('title');
        const code = formData.get('code');
        const language = formData.get('language');
        console.log("title is: " + title, "code is: " + code, "lang is: " + language);

        //create a new snippet in the database (the table is called Snippit like in out schema.prisma file)

        const snippet = await db.Snippit.create({
            data: {
                title: title,
                code: code,
                language: language,

            },
        });
        console.log("snippet created: ", snippet);
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