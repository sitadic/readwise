"use client";
import ThreadCard from "@/components/cards/ThreadCards";
import CommentCard from "@/components/cards/Comments";
import Comment from "@/components/forms/Comment";
import { getThreadComments } from "@/lib/actions/thread.actions"; // Adjust imports based on your API
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SampleReviewCard from "@/components/cards/SampleReviewCard"; // Assume this exists
import BookMetadataCard from "@/components/cards/BookMetadataCard"; // Assume this exists
import SkeletonCard from "@/components/shared/SkeletonCard";

const Page = () => {
    const { isLoaded, userId } = useAuth();
    const pathname = usePathname();
    const [item, setItem] = useState<any>(null);
    const [id, setId] = useState<String>("");

    useEffect(() => {
        if (isLoaded && userId) {
            const fetchData = async () => {
                let itemData = null;
                const idMatch = pathname.match(/\/thread\/(thread|review|book)_(.+)/);
                if (idMatch) {
                    const [, type, id] = idMatch;
                    setId(type)
                    itemData = await getThreadComments(`${type}_${id}`);
                    console.log("itemData", id);
                    setItem(itemData);
                }
            };
            fetchData();
        }
    }, [isLoaded, userId, pathname]);

    if (!item) {
        return (<div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>);
    }

    if (!userId) {
        return <div>User not authenticated</div>;
    }

    // Determine the card to render based on the URL path
    const renderCard = () => {
        if (id) {
            switch (id) {
                case "thread":
                    return (
                        <ThreadCard
                            key={item._id}
                            _id={item._id}
                            text={item.text}
                            author={item.author || { name: "", avatar: "" }}
                            createdAt={item.createdAt}
                            children={item.children} book_id={item.book_Id} rating={item.rating}
                            currentUserId={userId}
                        />
                    );
                case "review":
                    return (
                        <SampleReviewCard
                            key={item._id}
                            review_id={item._id}
                            user_id={item.user_id}
                            book_id={item.book_id}
                            rating={item.rating}
                            review_text={item.review_text}
                            n_votes={item.n_votes}
                            n_comments={item.n_comments}
                            showFullText={true} // Show full text by default
                            currentUserId={userId} // Pass the current
                        />

                    );
                case "book":
                    return (
                        <BookMetadataCard
                            key={item._id}
                            id={item._id}
                            book_id={item.book_id}
                            title={item.title}
                            authors={item.authors}
                            description={item.description}
                            currentUserId={userId}
                        />
                    );
                default:
                    return <div>Unknown item type</div>;
            }
        }
    };

    return (
        <section className="relative">
            <div>{renderCard()}</div>

            <div className="mt-7">
                <Comment
                    threadId={`${id}_${item._id}`}
                    currentUserId={userId}
                />
            </div>

            <div className="mt-10">
                {item.children &&
                    item.children.map((childItem: any) => (
                        <CommentCard
                            key={childItem._id}
                            id={childItem._id}
                            currentUserId={userId} // Updated to use actual userId
                            parentId={childItem.parentId}
                            content={childItem.text}
                            author={childItem.author}
                            createdAt={childItem.createdAt}
                            comments={childItem.children}
                            isComment
                        />
                    ))}
            </div>
        </section>
    );
};

export default Page;