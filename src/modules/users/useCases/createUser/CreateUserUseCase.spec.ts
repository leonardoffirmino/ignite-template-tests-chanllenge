import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";



let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Create a new user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });


  it("should be able to create a new user", async () => {

    const user: ICreateUserDTO = {
      name: "Test user",
      email: "test@rocket.com.br",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);


    expect(userCreated).toHaveProperty("id");
    expect(userCreated).toHaveProperty("name", user.name);

  });


  it("should not be able to create more than one user with the same email", async () => {
    const user: ICreateUserDTO = {
      name: "Test user",
      email: "test@rocket.com.br",
      password: "1234"
    };

    await createUserUseCase.execute(user);

    await expect(
      createUserUseCase.execute({
        name: "Test User2",
        email: "test@mail.com",
        password: "1234",
      })
    ).rejects.toEqual(new CreateUserError());
  });


});