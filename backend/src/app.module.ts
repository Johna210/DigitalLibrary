import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CinemasModule } from './cinemas/cinemas.module';
import { MoviesModule } from './movies/movies.module';
import { User } from './users/user.entity';
import { Cinema } from './cinemas/cinema.entity';
import { UserauthModule } from './auth/userauth/userauth.module';
import { CinemaAuthModule } from './auth/cinema-auth/cinema-auth.module';
import { CinemaAuthService } from './auth/cinema-auth/cinema-auth.service';
import { Movies } from './movies/movies.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cinema.sqlite',
      entities: [User, Cinema,Movies],
      synchronize: true,
    }),
    UsersModule,
    CinemasModule,
    MoviesModule,
    UserauthModule,
    CinemaAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CinemaAuthService],
})
export class AppModule {}
