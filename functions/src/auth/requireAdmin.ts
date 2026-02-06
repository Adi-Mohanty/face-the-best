import { HttpsError, CallableRequest } from "firebase-functions/v2/https";

export function requireAdmin(request: CallableRequest) {
  if (!request.auth || !request.auth.token?.admin) {
    throw new HttpsError(
      "permission-denied",
      "Admin access required"
    );
  }
}