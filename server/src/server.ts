import express from "express";
import path from "node:path";
import type { Request, Response } from "express";
import db  from "./config/connection.js";
import { expressMiddleware } from "@apollo-server-express4";
// import routes from "./routes/index.js";
import { ApolloServer } from "@apollo/server";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from "./utils/auth.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();
  

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(
    '/graphql', expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  // app.use(routes);

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
// function expressMiddleware(arg0: any, arg1: { context: any; }): import("express-serve-static-core").RequestHandler<{}, any, any, import("qs").ParsedQs, Record<string, any>> {
//   throw new Error("Function not implemented.");


