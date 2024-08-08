import { createUser, getAllUsers, createUserValidation, loginUserValidation, loginUser, deleteById, deleteByIdValidation, findById, findByIdValidation, confirmUser, updateValidation } from './UserController';


export const UserController = {
    createUser,
    getAllUsers,
    loginUser,
    deleteById,
    findById,
    confirmUser,
    updateValidation,
    findByIdValidation,
    deleteByIdValidation,
    createUserValidation,
    loginUserValidation
};