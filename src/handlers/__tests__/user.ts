// import request from "supertest";
//
// describe("getters", () => {
//   beforeEach(async () => {
//     const res = await request(app).post("/signin").send({
//       username: "daniel",
//       password: "admin",
//     });
//   });
//
//   it("should return the product with the specified ID", async () => {
//     // Mock the request and response objects
//     const req = {
//       body: {
//         id: "3db0d821-97c5-4fe1-b5a6-871785754517",
//       },
//     };
//     const res = {
//       json: jest.fn(),
//     };
//
//     // Call the function with the mock request and response objects
//     await getOneItem(req, res);
//
//     // Expect the response to contain the product data
//     expect(res.json).toHaveBeenCalledWith({ data: expect.any(Object) });
//     expect(res.json.mock.calls[0][0].data.id).toEqual(
//       "3db0d821-97c5-4fe1-b5a6-871785754517"
//     );
//     expect(res.json.mock.calls[0][0].data.name).toEqual("Monitor");
//   });
// });
//
// describe("Login", () => {
//   it("should set the is_logged cookie when the user logs in", async () => {
//     const res = await request(app).post("/signin").send({
//       username: "daniel",
//       password: "admin",
//     });
//
//     expect(res.status).toEqual(200);
//     expect(res.headers["set-cookie"]).toBeDefined();
//     expect(res.headers["set-cookie"][0]).toMatch(/logged_in=true/);
//   });
// });
