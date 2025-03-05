import BASE_API_URL from "@/constants/api";
import axios from "axios";

export const accountLogin = async (payload) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/auth/login`, payload);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Login failed");
  }
};
