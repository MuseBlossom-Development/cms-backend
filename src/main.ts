import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('CMS API 개발')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'access-token',
    )
    .addTag('CMS')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.use(helmet());

  // const redis = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.REDIS,
  //     options: {
  //       url: 'redis://localhost:6379',
  //     },
  //   },
  // );
  // await redis.listen();
  await app.listen(3000);
}
bootstrap();
