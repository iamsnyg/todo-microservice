<<<<<<< HEAD
=======
// import app from "./app.js";
// import { env } from "./config/env.js";
// import { connectRabbitMQ } from "./config/rabbitmq.js";


// const PORT = env.PORT || 3000;
// async function startServer() {

//     await connectRabbitMQ();

//     app.listen(PORT, () => {
//         console.log(`🚀 Auth Service running on ${PORT}`);
//     });

// }

// startServer();



>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
import app from "./app.js";
import { env } from "./config/env.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

<<<<<<< HEAD

const PORT = env.PORT || 3000;
async function startServer() {

    await connectRabbitMQ();

    app.listen(PORT, () => {
        console.log(`🚀 Auth Service running on ${PORT}`);
    });

=======
const PORT = env.PORT || 3000;

async function startServer() {
    await connectRabbitMQ();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Auth Service running on ${PORT}`);
    });
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
}

startServer();