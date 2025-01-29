import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(null, { status: 401 }); 
  }

  return new Response(null, { status: 200 }); 
}
