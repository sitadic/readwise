"use server";
import axios from "axios";

interface Params {
  text: string;
  author: string;
  path: string;
}

interface ThreadData {
  text: string;
  author: string; // Assuming author is a string (MongoDB ObjectId)
}

interface Comment {
  threadId: String;
  commentText: String;
  userId: String;
}

export async function createThreadFlask(threadData: ThreadData) {
  try {
    const response = await fetch("http://127.0.0.1:5000/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(threadData),
    });
    if (!response.ok) {
      throw new Error("Failed to create thread");
    }
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

export async function postComment(threadData: Comment) {
  try {
    const response = await fetch("http://127.0.0.1:5000/postComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(threadData),
    });
    if (!response.ok) {
      throw new Error("Failed to create thread");
    }
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

export const getPostById = async (threadId: string) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/getPostById", { threadId });
    return response.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return { error: "Failed to fetch post" };
  }
};


export const getThreadComments = async (threadId: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/getComments/${threadId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return { error: "Failed to fetch post" };
  }
};


