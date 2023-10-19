import { Connection } from "typeorm";


import authConfig from "../../../../config/auth";
import createConnection from "../../../../database";


let connection: Connection;


describe("show user profile controller ", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "335cd5e290807fd304c6b635e7cb0c5c";
    connection = await createConnection();
    await connection.runMigrations();
  });




});