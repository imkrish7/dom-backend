import { Injectable } from '@nestjs/common';
import { AnalyzerService } from './analyzer/analyzer.service';

@Injectable()
export class AppService {
	constructor(private analyzerService: AnalyzerService) {}

	async compareDOM(oldDOM: string, currentDOM: string): Promise<any> {
		return await this.analyzerService.analyzeDOM(oldDOM, currentDOM);
	}
}
