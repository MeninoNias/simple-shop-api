import { IUserRequest } from '../../database/dto/UserRequest';


declare global {
    namespace Express {
        interface Request {
            user?: IUserRequest;
        }
    }
}