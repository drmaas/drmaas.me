export class Counter {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(): Promise<Response> {
    const count = (await this.state.storage.get<number>("count")) ?? 0;
    await this.state.storage.put("count", count + 1);
    return Response.json({ counter: count + 1 });
  }
}