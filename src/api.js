import axios from "axios";

const instance = axios.create({baseURL: import.meta.env.VITE_API_URL})

export const API = {
    axios: instance
}
