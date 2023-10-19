import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUsecase: ShowUserProfileUseCase;


describe("Show user profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUsecase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to return the user profile", async () => {
    const user: ICreateUserDTO = {
      name: "Test User",
      email: "test@test.com.br",
      password: "1243"

    };


    const userCreated = await createUserUseCase.execute(user);
    const user_id = <string>userCreated.id;

    const userFound = await showUserProfileUsecase.execute(user_id);

    expect(userFound).toHaveProperty("name", user.name);
    expect(userFound).toHaveProperty("email", user.email);
  });


  it("should not be able to return a the exists user", async () => {
    expect(async () => {
      await showUserProfileUsecase.execute("fake_id");
    }).rejects.toBeInstanceOf(AppError);
  });

});
