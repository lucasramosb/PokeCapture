import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  try {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    const app = await NestFactory.create(AppModule);

    app.enableCors({});

    await app.listen(3001);
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
  }
}
bootstrap();