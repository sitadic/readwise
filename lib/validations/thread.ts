import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, "Minimum 3 Characters")
    .max(500, "Limit Reache, Maximum 500 Character Allowed"),

  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, "Minimum 3 Characters")
    .max(500, "Limit Reache, Maximum 500 Character Allowed"),

});
