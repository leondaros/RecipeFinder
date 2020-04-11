import { createServer } from "http";

const server = createServer((req, res) => {
    res.end("Test");
});

server.listen(3000)