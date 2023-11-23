import db from "@/server/db";
import { pollOptionVotes } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import PollMetrics from "./PollMetrics";
import PollOptions from "./PollOptions";
import { z } from "zod";

export default async function Poll({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const optionsSchema = z.object({
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
	WHERE poll_id = ${id}
	GROUP BY option_id
) AS votes on options.id = votes.option_id
WHERE options.poll_id = ${id} 
    `;

  const response = await db.execute(query);
  const options = optionsSchema.array().parse(response.rows);

  const votes = await db.query.pollOptionVotes.findMany({
    where: eq(pollOptionVotes.pollId, id),
  });
  const userVote = votes.find((vote) => vote.voterId === userId);

  if (userVote) {
    // show metrics
    return (
      <PollMetrics
        pollId={id}
        userVote={userVote}
        options={options}
        votes={votes.length}
      />
    );
  } else {
    // show options
    return <PollOptions options={options} userId={userId} />;
  }
}
