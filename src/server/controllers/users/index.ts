import { createUser, getAllUsers, createUserValidation, loginUserValidation, loginUser, deleteById, deleteByIdValidation, findById, findByIdValidation } from './UserController';


export const UserController = {
    createUser,
    getAllUsers,
    loginUser,
    deleteById,
    findById,
    findByIdValidation,
    deleteByIdValidation,
    createUserValidation,
    loginUserValidation
};