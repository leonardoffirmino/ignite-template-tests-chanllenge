import { Connection } from "typeorm";
import request from "supertest";

import authConfig from "../../../../config/auth";
import createConnection from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;


describe("show user profile controller ", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "335cd5e290807fd304c6b635e7cb0c5c";
    connection = await createConnection();
    await connection.runMigrations();
  });


  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to return a user profile", async () => {
    const user = {
      name: "Test user",
      email: "test@test.com.br",
      password: "1234"
    };

    await request(app).post("/api/v1/users").send(user);

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com.br",
      password: "1234"
    });


    const { token } = auth.body;


    const response = await request(app).get("/api/v1/profile").send().set({ Authorization: `Bearer ${token}` });


    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", user.name);
    expect(response.body).toHaveProperty("email", user.email);
  });


  it("should not be able to return a alredy exists user", async () => {
    const token = "fakeToken";

    const response = await request(app).get("/api/v1/profile").send().set({ Authorization: `Bearer ${token}` });


    expect(response.status).toBe(401);
  })


});