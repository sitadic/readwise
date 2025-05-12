"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommentValidation } from "@/lib/validations/thread";
import { postComment } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserId }: Props) => {
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    try {
      await postComment({
        threadId,
        commentText: values.thread,
        userId: currentUserId,
      });

      form.reset();
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="flex items-center gap-3 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Write a comment..."
                    disabled={isSubmitting}
                    className="border rounded-md focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-400 transition disabled:opacity-50"
          >
            {isSubmitting ? "Replying..." : "Reply"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Comment;
