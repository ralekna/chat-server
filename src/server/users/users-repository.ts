import User from "./user";
import {Injectable} from "container-ioc";

export interface IUserRepository {

  add(user: User): void;

  getUserBySocketId(id: string): User;

  getUserByNickname(nick: string): User;

  remove(user: User): void;

  removeBySocketId(id: string): void;

}

@Injectable()
export class UserRepository implements IUserRepository {
  private users: {[socketId: string]: User} = {};

  add(user: User): void {
    this.users[user.socket.id] = user;
  }

  getUserByNickname(nick: string): User {
    return Object.values(this.users).filter(user => user.nick === nick)[0];
  }

  getUserBySocketId(id: string): User {
    return this.users[id];
  }

  remove(user: User): void {
    delete this.users[user.socket.id];
  }

  removeBySocketId(id: string): void {
    delete this.users[id];
  }
}

export const TUserRepository = Symbol('TUserRepository');