/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalyzerService {
	constructor(private configService: ConfigService) {}

	private extractPoints(summary: string){
		// Regular expression to match lines starting with "- "
		// // const regex1 = /^[\d]. (.+)$/gm;
		// // const regex2 = /^- (.+)$/gm;
		// console.log(summary);
		const regex = /^[\d]. (.+)|^- (.+)$/gm;

		// Extract lines starting with "- or 1."
		const matches = [...summary.matchAll(regex)];
	
		// Collect second DOM changes
		const secondDOMChanges = matches.map(match => match[1]);
		
		return secondDOMChanges.map((point)=>{
			if(point){
				const removeColon = point.split(":");
				if(removeColon.length > 1){
					return removeColon[1].trim();
				}
				return removeColon[0].trim();
			}
		});
	}

	private async getAnswers(prompt: string){
		const url = this.configService.get('apiURI');
			const apiKey = this.configService.get('apiKey');
			const response = await fetch(url,{
				method: 'POST',
				headers: {accept: 'application/json', 'content-type': 'application/json', Authorization: `Bearer ${apiKey}`},
				body: JSON.stringify({
					model: 'pplx-7b-online',
					messages: [
						{role: 'system', content: 'Exclude HTML elements and explain of the elements'},
						{ role: 'user', content: prompt },
					],
				})
			})
			const result = await response.json();
			if(result.error){
				throw new HttpException({
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: 'Internal Server Error'
				}, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			return result.choices;
	}

	async analyzeDOM(oldDOM: string, currentDOM: string) {
		const prompt = `Find differences of the following DOMS:\n\n First DOM. ${oldDOM}\n\n Second DOM. ${currentDOM}\n\n which utilize taildwindcss for styling and explain the visual diffrences of second dom has in natural language like this 'Side bar is present in second DOM'`;
		try {
			const domAnalyis = await this.getAnswers(prompt);
			const summaryPrompt = `Explain the answers in points ${domAnalyis[0].message.content} without using tailwindcss classes and HTML tags in natural lanugage`
			const summaryAnalyis = await this.getAnswers(summaryPrompt);
			const points = this.extractPoints(summaryAnalyis[0].message.content);
			if(points.length == 0 ){
				throw new HttpException({
					status: HttpStatus.NO_CONTENT,
					error: 'Something went wrong'
				}, HttpStatus.NO_CONTENT);
			}
			return points;
		} catch (error) {
			
			throw error;
		}
	}
}
