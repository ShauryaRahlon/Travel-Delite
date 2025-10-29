// Node.js global type declarations
declare global {
  var prisma: import("@prisma/client").PrismaClient | undefined;

  // Basic Node.js process interface
  var process:
    | {
        env: {
          NODE_ENV?: string;
          [key: string]: string | undefined;
        };
      }
    | undefined;
}

export {};
