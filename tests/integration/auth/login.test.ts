import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../../src/app.js";

describe("POST /api/v1/auth/login", () => {
  it("should login successfully", async () => {
    const timestamp = Date.now();

    const email = `user-${timestamp}@example.com`;
    const username = `kushal-${timestamp}`;
    const password = "password123";

    // Register user
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        username,
        email,
        password,
      });

    // Login
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password,
      });

    expect(response.status).toBe(200);

    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.username).toBe(username);

    expect(response.body.accessToken).toBeDefined();
    expect(response.headers["set-cookie"]).toBeDefined();
expect(response.headers["set-cookie"][0]).toContain("refreshToken=");
expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
  });

  it("should return 401 for invalid password", async () => {
  const timestamp = Date.now();

  const email = `user-${timestamp}@example.com`;
  const username = `kushal-${timestamp}`;
  const password = "password123";

  await request(app)
    .post("/api/v1/auth/register")
    .send({
      username,
      email,
      password,
    });

  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email,
      password: "wrongpassword",
    });

  expect(response.status).toBe(401);

  expect(response.body.error.message).toBe(
    "Invalid email or password"
  );
});

it("should return 401 when email does not exist", async () => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "unknown@example.com",
      password: "password123",
    });

  expect(response.status).toBe(401);
  expect(response.body.error.message).toBe(
    "Invalid email or password"
  );
});
});