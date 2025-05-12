"use server";
import axios from "axios";

export async function saveUser({
  id,
  email,
  name,
  avatar_url,
  bio,
  preferences,
  interests,
  following,
}: {
  id: string;
  email: string;
  name: string;
  avatar_url: {};
  bio: string;
  preferences: string[];
  interests: string[];
  following: string[];
}) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/users/createUser",
      {
        id,
        email,
        name,
        avatar_url,
        bio,
        preferences,
        interests,
        following,
      }
    );
    return response.data;
  } catch (e: any) {
    console.log(`Failed to save user: ${e.message}`);
  }
}
export async function getOnboardingStatus(userId: string): Promise<boolean> {
  try {
    const response = await axios.post<{ onboarded: boolean }>(
      "http://127.0.0.1:5000/users/onboardStatus",
      { userId }
    );
    return response.data.onboarded; // Return only the `onboarded` value
  } catch (e) {
    console.log("ERROR FETCHING ONBOARDING STATUS : ", e);
    return false; // Return `false` in case of an error
  }
}

export async function likePost(
  userId: string | null | undefined,
  postId: string,
  postType: string,
  bookId: string
): Promise<void> {
  try {
    await axios.post("http://127.0.0.1:5000/users/likedBook", {
      userId,
      postId,
      postType,
      bookId,
    });
  } catch (error) {
    console.error(`Failed to like ${postType} ${postId} (bookId: ${bookId}) for user ${userId}:`, error);
    throw new Error(`Could not like ${postType}`);
  }
}

export async function unlikePost(
  userId: string | null | undefined,
  postId: string,
  postType: string,
  bookId: string
): Promise<void> {
  try {
    await axios.request({
      url: "http://127.0.0.1:5000/users/likedBook",
      method: "DELETE",
      data: {
        userId,
        postId,
        postType,
        bookId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to unlike ${postType} ${postId} (bookId: ${bookId}) for user ${userId}:`, error);
    throw new Error(`Could not unlike ${postType}`);
  }
}