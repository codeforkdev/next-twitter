// src/db/seed.ts
import { db } from "./db";
import { users } from "./schema";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

const main = async () => {
  const data: (typeof users.$inferInsert)[] = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      id: nanoid(),
      displayName: faker.person.fullName(),
      handle: faker.person.firstName(),
      avatar: faker.image.avatarGitHub(),
    });
  }

  console.log("Seed start");
  await db.insert(users).values(data);
  console.log("Seed done");
};

main();
