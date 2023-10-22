import { db } from "../../../../drizzle/db";
import * as schema from "../../../../drizzle/schema";
import { user as devUser } from "@/mock/mock-data";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

import chalk from "chalk";

type User = typeof schema.users.$inferInsert;
type Post = typeof schema.posts.$inferInsert;

async function seedUsers() {
  let users: User[] = [devUser];

  for (let i = 2; i < 5; i++) {
    users.push({
      id: nanoid(),
      displayName: faker.person.fullName(),
      handle: faker.person.firstName(),
      avatar: faker.image.avatarGitHub(),
    });
  }

  try {
    await db.insert(schema.users).values(users);
    users = await db.query.users.findMany();
    console.log("️✅   Create users");
    return users;
  } catch (e) {
    console.log(chalk.red("⚠️   Error: Create users\n", e));
    throw new Error("");
  }
}

async function seedPosts(users: User[]) {
  // Create posts for each user
  let posts: Post[] = [];
  for (let user of users) {
    for (let i = 0; i < 2; i++) {
      posts.push({
        id: nanoid(),
        userId: user.id,
        text: faker.lorem.lines({ min: 1, max: 3 }),
      });
    }
  }
  try {
    await db.insert(schema.posts).values(posts);
    posts = await db.query.posts.findMany();
    console.log("️✅   Create posts");
  } catch (e) {
    console.log(chalk.red("⚠️   Error: Create posts\n", e));
  }
}

async function clearTables() {
  try {
    await db.delete(schema.conversations);
    await db.delete(schema.posts);
    await db.delete(schema.users);
    console.log("️✅   Clear tables");
  } catch (e) {
    console.log(chalk.red("⚠️   Error: Deleting users\n", e));
  }
}

export async function GET(request: Request) {
  console.log(chalk.cyan("Start seeding"));

  faker.seed(1);

  await clearTables();
  let users = await seedUsers();
  let posts = await seedPosts(users);

  console.log(chalk.green("Done seeding"));
  // return {};
  return Response.json({ users, posts });
}
