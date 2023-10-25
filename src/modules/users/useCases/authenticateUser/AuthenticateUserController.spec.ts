import request from "supertest";
import { Connection } from "typeorm";
import auth from "../../../../config/auth";

import createConnection from "../../../../database";
import { app } from "../../../../app";



let connection: Connection;


describe("Authenticate user controller", () => {
  beforeAll(async () => {
    auth.jwt.secret = "";
    connection = await createConnection();
    await connection.runMigrations();
  });



  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user ", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@test.com.br",
      password: "1234",
    });


    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com.br",
      password: "1234",
    });


    expect(response.body.user).toHaveProperty("email", "test@test.com.br");
    expect(response.body).toHaveProperty("token");
  });


  it("should not be able to authenticate alredy exists user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@user.com.br",
      password: "1234",
    });

    expect(response.status).toBe(401);

  });

  it("should not be able to authenticate a user with incorret password", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@test.com.br",
      password: "1234",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com.br",
      password: "123",
    });

    expect(response.status).toBe(401);
  });



});