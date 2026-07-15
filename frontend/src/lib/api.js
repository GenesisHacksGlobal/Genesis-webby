import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const submitRSVP = (payload) => axios.post(`${API}/rsvp`, payload);
export const submitContact = (payload) => axios.post(`${API}/contact`, payload);
export const getRSVPCount = (slug = "no-agenda-meetup-2") =>
    axios.get(`${API}/rsvp/count`, { params: { event_slug: slug } });
