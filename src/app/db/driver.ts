import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import * as schema from "@/server/db/schema";
import connection from "@/server/db";

export type Driver = PlanetScaleDatabase<typeof schema>;

const db: Driver = connection;
export default db;
