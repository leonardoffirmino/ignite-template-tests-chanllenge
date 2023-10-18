import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";



let connection: Connection;


describe("Create user controller ", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });


  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user ", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test a new user",
      email: "test@test.com.br",
      password: "1234"
    });

    expect(response.status).toBe(201);
  });


  it("should not be able to create the user with the email already in use", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test a new user",
      email: "test@test.com.br",
      password: "1234"
    });


    const response = await request(app).post("/api/v1/users").send({
      name: "Test a new user 2",
      email: "test@test.com.br",
      password: "4321"
    });

    expect(response.status).toBe(400);
  });



});