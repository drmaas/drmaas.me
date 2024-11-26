## Principles (of web development)

1. Keep the UI as simple as possible. Offload as much as possible to servers.

Example: microservice orchestration. You could call the needed APIs from the browser, or you could create server to do it for you. The former bundles complexity into the user experience, increases latency (due to CPU/memory limits of the user's computer), and increases network calls. The latter abstracts complexity, uses powerful servers and fast networks to reduce latency, and decouples business logic from the user experience.

1. Start your projects as you mean to continue them, because you will almost always continue them as you started. 

Example: Complexity always increases. If you know an application will evolve to support many different types of databases, then you should design this into the application from the beginning.

1. Engage with the joyful struggle (thanks John Carliss). This means finding peace, contentment, and even happiness while struggling, learning, engaging, building, failing, and growing.

1. 