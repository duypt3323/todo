const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = require("../app");
const UserModel = require("../models/user.model");
const mailer = require("../mailer");

jest.mock("../models/user.model");
jest.mock("../mailer");

const fakeUser = {
  _id: "user123",
  email: "test@example.com",
  fullname: "Test User",
  password: "hashed_password",
};

describe("Auth API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();

    if (global.server) {
      global.server.close();
    }
  });

  describe("POST /api/v1/auth/signup", () => {
    test("Check signup successfully", async () => {
      UserModel.findOne.mockResolvedValue(null);

      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed_password");

      UserModel.mockImplementation(() => ({
        ...fakeUser,
        save: jest.fn().mockResolvedValue(fakeUser),
      }));

      const res = await request(app).post("/api/v1/auth/signup").send({
        email: fakeUser.email,
        password: "123456",
        fullname: fakeUser.fullname,
      });

      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe(fakeUser.email);
      expect(res.body.access_token).toBeDefined();
      expect(mailer).toHaveBeenCalledTimes(1);
    });
  });

  test("Fail to signup due to the email is already exists", async () => {
    UserModel.findOne.mockResolvedValue(fakeUser);

    const res = await request(app).post("/api/v1/auth/signup").send({
      email: fakeUser.email,
      password: "123456",
      fullname: fakeUser.fullname,
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("The email is already exists");
  });
});

describe("POST /auth/signin", () => {
  test("Signin successfully", async () => {
    UserModel.findOne.mockResolvedValue(fakeUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const res = await request(app).post("/api/v1/auth/signin").send({
      email: fakeUser.email,
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeDefined();

    const decoded = jwt.verify(
      res.body.access_token,
      process.env.JWT_SECRET || "secret_test"
    );
    expect(decoded.email).toBe(fakeUser.email);
  });

  test("Fail to sign in due to the email being invalid", async () => {
    UserModel.findOne.mockResolvedValue(null);

    const res = await request(app).post("/api/v1/auth/signin").send({
      email: "wrong@example.com",
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid credentials");
  });

  test("Fail to sign in due to the password being invalid", async () => {
    UserModel.findOne.mockResolvedValue(fakeUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const res = await request(app).post("/api/v1/auth/signin").send({
      email: fakeUser.email,
      password: "wrong_password",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid credentials");
  });
});
