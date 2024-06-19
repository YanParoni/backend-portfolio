import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '@/app/services/user.service';
import { UserController } from '@/presentation/controllers/user.controller';
import { UserRepository } from '@/infra/repositories/user.repository';
import { UserSchema, UserSchemaSchema } from '@/infra/schemas/user.schema';
import { AuthModule } from '@/infra/modules/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
