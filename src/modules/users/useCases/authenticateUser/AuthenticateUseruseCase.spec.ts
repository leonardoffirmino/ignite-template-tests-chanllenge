import auth from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";




let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;


describe("Authenticate user", () => {
  beforeEach(() => {
    auth.jwt.secret = "";
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate the user", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com.br",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: "1234",
    });

    expect(auth.user).toHaveProperty("email", user.email);
    expect(auth).toHaveProperty("token");
  });

  it("should not be able to authenticate the user alredy exists", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "fakeUser@mail.com",
        password: "1234",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be able to authenticate an user with an incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "Test User",
      email: "test@mail.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "Wrong password",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });


});