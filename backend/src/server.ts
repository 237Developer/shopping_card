import app from "./app";

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

server.timeout = 120000;
server.keepAliveTimeout = 120000;
