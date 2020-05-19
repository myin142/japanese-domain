export class HttpService {
	async get<T>(url: string): Promise<T> {
		return this.request(url, 'GET');
	}

	private async request<T>(url: string, method: string): Promise<T> {
		const response = await fetch(url, {
			method,
		});
		return response.json();
	}
}

export const http = new HttpService();
