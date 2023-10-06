import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
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
  });

});