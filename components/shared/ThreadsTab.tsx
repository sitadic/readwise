import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCards";

interface Props {
    currentUserId: string,
    accountId: string,
    accountType: string
}
const ThreadsTab = async ({
    currentUserId,
    accountId,
    accountType }: Props) => {

    let reuslt = await fetchUserPosts(accountId);

    if (!reuslt) redirect('/');

    return (

        <section className="mt-9 flex flex-col gap-10">
            {
                reuslt.threads.map((thread: any) => (
                    <ThreadCard
                        key={thread._id}
                        id={thread._id}
                        currentUserId={'1'}
                        parentId={thread.parentId}
                        content={thread.text}
                        author={thread.author}
                        createdAt={thread.createdAt}
                        comments={thread.children}
                    />
                ))
            }
        </section>
    )
}


export default ThreadsTab;