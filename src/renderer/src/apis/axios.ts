import axios from "axios";

export const nextInstance = axios.create({
  baseURL: "BASE_URL",
  headers: {
    "Content-Type": "application/json"
  }
});
