import axios from 'axios'

export default axios.create({
    // baseURL: 'http://localhost:5000',
    baseURL: 'https://to-do-list-v2-steel.vercel.app',
    // timeout: 1000,
})


