import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		rawBody: true,
	});
	app.useBodyParser('json', { limit: '10mb' });
	app.enableCors();
	await app.listen(3000);
}
bootstrap();
