import app from "../../server";
import supertest from "supertest";
import request from "supertest";

describe("GET /", () => {
  it("should send back some data", async () => {
    const test = 1 + 1;

    expect(test).toBe(2);
  });
});
