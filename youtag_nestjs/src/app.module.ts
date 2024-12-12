import { Module } from '@nestjs/common';
import { GraphqlModule as GQL } from './GraphQL.module/Graphql.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UserModule } from './User.module/User.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false, // Disable default playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo Sandbox
    }),
    GQL,
    UserModule.UserModule,
  ],
})
export class AppModule {}
