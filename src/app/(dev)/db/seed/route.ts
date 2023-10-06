import { db } from "@/drizzle/db";
import {
  followings,
  posts,
  users,
  // usersToFollowers,
  // usersToFollowing,
} from "@/drizzle/schema";
import { user } from "@/mock/mock-data";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type User = typeof users.$inferInsert;
type Post = typeof posts.$inferInsert;
type Following = typeof followings.$inferInsert;
// type UsersToFollowing = typeof usersToFollowing.$inferInsert;
// type UsersToFollowers = typeof usersToFollowers.$inferInsert;
type Data = {
  users: User[];
  posts: Post[];
  followings: Following[];
  // usersToFollowings: UsersToFollowing[];
  // usersToFollowers: UsersToFollowers[];
};
export async function GET(request: Request) {
  const data: Data = {
    users: [],
    posts: [],
    followings: [],
    // usersToFollowers: [],
    // usersToFollowings: [],
  };
  faker.seed(1);

  // clean up
  await db.delete(users);

  // Create Users
  for (let i = 0; i < 20; i++) {
    data.users.push({
      id: nanoid(),
      displayName: faker.person.fullName(),
      handle: faker.person.firstName() + nanoid(),
      avatar: faker.image.avatarGitHub(),
    });
  }
  data.users.push(user);
  const newUsers = await db.insert(users).values(data.users).returning();

  // Create posts for each user
  for (let user of newUsers) {
    for (let i = 0; i < 10; i++) {
      data.posts.push({
        id: nanoid(),
        userId: user.id,
        text: faker.lorem.lines({ min: 1, max: 3 }),
      });
    }
  }
  const newPosts = await db.insert(posts).values(data.posts).returning();

  // Create followings
  // for (let potentialFollower of newUsers) {
  //   for (let user of newUsers) {
  //     const randomNumber = getRandomArbitrary(1, 10);
  //     if (randomNumber < 4) {
  //       data.followings.push({
  //         id: nanoid(),
  //         followerId: potentialFollower.id,
  //         followingId: user.id,
  //       });

  //       data.usersToFollowers.push({
  //         userId: user.id,
  //         followerId: potentialFollower.id,
  //       });

  //       data.usersToFollowings.push({
  //         userId: potentialFollower.id,
  //         followingId: user.id,
  //       });
  //     }
  //   }
  // }

  // await db.insert(followings).values(data.followings);

  // await db.insert(usersToFollowers).values(data.usersToFollowers);
  // await db.insert(usersToFollowing).values(data.usersToFollowings);

  return Response.json({ newUsers });
}
