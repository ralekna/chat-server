import User from "./user";

const SERVER_BOT_USER = new User({id: 'SERVER', rooms: {}}, 'SERVER');
Object.freeze(SERVER_BOT_USER);
export default SERVER_BOT_USER;
