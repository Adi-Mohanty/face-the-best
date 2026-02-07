import { HttpsError } from "firebase-functions/v2/https";
import { CallableRequest } from "firebase-functions/v2/https";

export function requireAdmin(
  request: CallableRequest<any>
): asserts request is CallableRequest<any> & { auth: { uid: string } } {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "Admin access required");
  }
}