import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyzerService } from './analyzer/analyzer.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService, AnalyzerService],
})
export class AppModule {}
