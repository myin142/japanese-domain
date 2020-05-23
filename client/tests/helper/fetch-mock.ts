export function mockFetch(body: object): void {
    (global as any).fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(body),
    }));
}