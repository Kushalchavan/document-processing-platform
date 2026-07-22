import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../../src/app.js";

describe("POST /api/v1/auth/logout", () => {
  it("should logout successfully", async () => {
    const agent = request.agent(app);

    const timestamp = Date.now();

    const email = `user-${timestamp}@example.com`;
    const username = `kushal-${timestamp}`;
    const password = "password123";

    await agent.post("/api/v1/auth/register").send({
      username,
      email,
      password,
    });

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email,
      password,
    });

    const accessToken = loginResponse.body.accessToken;

    const response = await agent
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Logged out successfully"
    );

    expect(response.headers["set-cookie"]).toBeDefined();
  });

  // refresh after logout
  it("should reject refresh token after logout", async () => {
  const agent = request.agent(app);

  const timestamp = Date.now();

  const email = `user-${timestamp}@example.com`;
  const username = `kushal-${timestamp}`;
  const password = "password123";

  await agent.post("/api/v1/auth/register").send({
    username,
    email,
    password,
  });

  const login = await agent.post("/api/v1/auth/login").send({
    email,
    password,
  });

  await agent
    .post("/api/v1/auth/logout")
    .set("Authorization", `Bearer ${login.body.accessToken}`);

  const refresh = await agent.post("/api/v1/auth/refresh");

  expect(refresh.status).toBe(401);
});
});