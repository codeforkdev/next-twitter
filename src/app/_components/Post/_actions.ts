"use server";

import { broadcast } from "@/actions/posts";
import db from "@/server/db";
import { pollOptionVotes } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type SubmitPollVoteParams = {
  userId: string;
  pollId: string;
  optionId: string;
};
export async function submitPollVote(params: SubmitPollVoteParams) {
  const { userId, pollId, optionId } = params;

  await db
    .delete(pollOptionVotes)
    .where(
      and(
        eq(pollOptionVotes.pollId, pollId),
        eq(pollOptionVotes.voterId, userId),
      ),
    );

  const id = nanoid();
  await db
    .insert(pollOptionVotes)
    .values({ id, optionId, pollId, voterId: userId });

  const schema = z.object({
    id: z.string(),
    pollId: z.string(),
    text: z.string(),
    votes: z.coerce.number(),
  });

  const query = sql`
    SELECT options.poll_id as pollId, options.id, IFNULL(votes, 0) as votes, text
FROM poll_options AS options
LEFT JOIN (
	SELECT option_id, count(*) as votes
	FROM poll_option_votes as votes
	WHERE poll_id = ${pollId}
	GROUP BY option_id
) AS votes on options.id = votes.option_id
WHERE options.poll_id = ${pollId} 
    `;

  const response = await db.execute(query);
  const metrics = schema.array().parse(response.rows);

  await broadcast({ party: "poll", roomId: pollId, data: metrics });
  revalidatePath("/");
}
