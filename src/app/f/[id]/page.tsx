import { redirect } from "next/navigation";
import { createShortURLClick, getShortURLByShortURL } from "~/server/db/models/shorturls";

export default async function FormPage({ params }: { params: { id: string } }) {
  const shortUrls = await getShortURLByShortURL(params.id);
  
  if (!shortUrls.length) {
    return redirect("/404");
  }

  const shortUrl = shortUrls[0];

  if (!shortUrl) {
    return redirect("/404");
  }
  
  // Create click record
  await createShortURLClick({
    id: crypto.randomUUID(),
    formURLShortId: shortUrl.id,
    source: "direct", 
    clickedAt: new Date()
  });

  return redirect(shortUrl.responderURI);
}
