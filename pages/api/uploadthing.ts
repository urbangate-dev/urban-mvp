import { createRouteHandler } from "uploadthing/next-legacy";
import { ourFileRouter } from "../../utils/uploadthing";

export default createRouteHandler({
  router: ourFileRouter,
});
