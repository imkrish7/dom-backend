import { Controller, Get, Header, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	hellowWorld(): string {
		return 'Hello world';
	}

	@Post('/analyze')
	@Header('Content-Type', 'application/json')
	async getDOMAnalyze(@Req() req: Request): Promise<any> {
		const { oldDOM, currentDOM } = req.body;
		return await this.appService.compareDOM(oldDOM, currentDOM);
	}
}
