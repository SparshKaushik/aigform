import { auth } from "~/server/auth";

export default auth((req) => {
  console.log(req);
});

// Optionally, don't invoke Middleware on some paths
export const config = {
//   matcher: ["/dashboard/**"],
};
