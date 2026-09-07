const productionApiUrl = "https://dijkstra-demo-1.onrender.com";
const developmentApiUrl = "http://localhost:5000";

export const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL ||
	(process.env.NODE_ENV === "production" ? productionApiUrl : developmentApiUrl);