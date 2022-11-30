import fp from "fastify-plugin";
import { appendFile } from "node:fs/promises";

export default fp(async function (fastify) {
  fastify.addHook("onResponse", async (req) => {
    const { id = "", role = "" } = req?.user ?? {};
    const line = `${new Date().toISOString()},${id},${role},${req.method},${req.url}\n`;
    await appendFile("assignment.log", line);
  });
});
