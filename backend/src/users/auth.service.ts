import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(
    fullname: string,
    email: string,
    username: string,
    password: string,
  ) {
    // See if email is already in use
    const emails = await this.usersService.findEmail(email);
    if (emails.length) {
      throw new BadRequestException('email in use');
    }

    // See if username is already in use
    const usernames = await this.usersService.findUsername(username);
    if (usernames.length) {
      throw new BadRequestException('username already in use');
    }

    // Hash the users password
    // *...Generate a salt
    const salt = randomBytes(8).toString('hex');

    // *...Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // *...Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new User and save it
    const user = await this.usersService.create(
      fullname,
      email,
      username,
      result,
    );

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.findEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect password');
    }
    return user;
  }
}
