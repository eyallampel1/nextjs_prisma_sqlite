import { db } from '@/db';
import Link from "next/link";

export  async function ShowSnippit2() {
    const snippets = await db.SnippitTable.findMany();
console.log("snippet is: ", snippets);

//loop through the snippet array and display each snippet
return (
    <div>
        {snippets.map((snippit) => (
            <div key={snippit.id} className={"m-3 p-3 border border-black flex flex-col space-y-4"}>
                <div className={"flex items-center space-x-2"}>
                    <div className={"text-3xl"}>Title: </div>
                    <div>{snippit.title}</div>
                </div>
                <div className={"flex items-center space-x-2"}>
                    <div className={"text-3xl"}>Code: </div>
                    <div>{snippit.code}</div>
                </div>
                <div className={"flex items-center space-x-2"}>
                    <div className={"text-3xl"}>Language: </div>
                    <div>{snippit.language}</div>
                </div>
            </div>
        ))}
        <Link href="/">Back to home</Link>
    </div>
);
}