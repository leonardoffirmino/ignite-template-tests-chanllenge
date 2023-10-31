import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "./CreateStatementController";
import { AppError } from "../../../../shared/errors/AppError";




let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;



describe("Create statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    );
  });


  it("should be able to make a deposit the a user account", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com.br",
      password: "1234"
    };


    const user_id = <string>(await createUserUseCase.execute(user)).id;


    const statement = {
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit Test"
    };

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement).toHaveProperty("type", statement.type);
    expect(createdStatement).toHaveProperty("amount", statement.amount);
  });


  it("should be able to withdraw credit from to user account", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com.br",
      password: "1234",
    };

    const user_id = <string>(await createUserUseCase.execute(user)).id;


    await createStatementUseCase.execute({
      user_id,
      type: "withdraw" as OperationType,
      amount: 120,
      description: "test withdraw",
    });


    await createStatementUseCase.execute({
      user_id,
      type: "withdraw" as OperationType,
      amount: 120,
      description: "test withdraw",
    });

    const balance = await getBalanceUseCase.execute({ user_id });


    expect(balance).toHaveProperty("balance", 0);


  });


  it("should not be able to withdraw credit from to user account", async () => {
    expect(async () => {
      const user_id = "fake_user";


      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 120,
        description: "test withdraw",
      });
    }).rejects.toBeInstanceOf(AppError);
  });


  it("should not be able to make a deposit in an unexistent user account", async () => {
    expect(async () => {
      const user_id = "fake_user";


      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 120,
        description: "test withdraw",
      });
    }).rejects.toBeInstanceOf(AppError);
  });


  it("should not be able to withdraw credits from to user account without credits", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@test.com",
        password: "1234",
      };

      const user_id = <string>(await createUserUseCase.execute(user)).id;

      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 120,
        description: "test withdraw",
      });
    }).rejects.toBeInstanceOf(AppError);
  });




});