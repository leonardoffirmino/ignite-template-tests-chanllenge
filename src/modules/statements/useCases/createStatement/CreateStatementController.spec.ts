import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import authConfig from "../../../../config/auth";
import createConnection from "../../../../database";




let connection: Connection;

describe("Create controller statement", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "335cd5e290807fd304c6b635e7cb0c5c";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to make a deposit with user account", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@test.com.br",
      password: "1234",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "Test",
      password: "1234",
    });

    const { token } = auth.body;

    const statement = {
      amount: 100,
      description: "Deposit test",
    };

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send(statement)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("description", statement.description);
    expect(response.body).toHaveProperty("amount", statement.amount);
  });

  it("should be able to withdraw credit from a user account", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test user",
      email: "User Supertest",
      password: "1234",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com.br",
      password: "1234",
    });

    const { token } = auth.body;

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toHaveProperty("balance", 0);
  });

  it("should not be able to withdraw credit from a unexistent user account", async () => {
    const token = "fake_token";

    const statement = {
      amount: 100,
      description: "Deposit test",
    };

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send(statement)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
  });

  it("should not be able to withdraw credit from a user account without credit", async () => {
    await request(app).post("/api/v1/users").send({
      name: "test",
      email: "test@test.com.br",
      password: "1234",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "User Supertest",
      password: "1234",
    });

    const { token } = auth.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});