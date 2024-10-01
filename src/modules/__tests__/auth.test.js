const createJWT = require("../auth").createJWT;
const decodeToken = require("../auth").decodeToken;
const protectWithRole = require("../auth").protectWithRole;
const jwt = require("jsonwebtoken");

describe("createJWT", () => {
  const user = { id: "user_id", username: "testuser", role: "user" };
  const mockSign = jest.spyOn(jwt, "sign");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call jwt.sign with the correct payload and secret", () => {
    const token = "sample_token";
    mockSign.mockReturnValueOnce(token);

    const result = createJWT(user);

    expect(mockSign).toHaveBeenCalledWith(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET
    );
    expect(result).toEqual(token);
  });
});
