import { prisma } from "~/server/db";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import superjson from "superjson";

export const generateSSGHelper = () =>
    createServerSideHelpers({     
      router: appRouter,
      ctx: { prisma, userId: null },
      transformer: superjson, // optional - adds superjson serialization
    });