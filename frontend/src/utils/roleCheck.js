import {jwtDecode} from "jwt-decode";

export const hasRole = (token, role) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.roles.includes(role);
  } catch (error) {
    return false;
  }
};
