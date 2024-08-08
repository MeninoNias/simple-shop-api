import { createUser, getAllUsers, createUserValidation, loginUserValidation, loginUser, deleteById, deleteByIdValidation, findById, findByIdValidation, confirmUser, updateValidation, confirmValidation, updateUser } from './UserController';


export const UserController = {
    createUser,
    getAllUsers,
    loginUser,
    deleteById,
    findById,
    updateUser,
    confirmUser,
    updateValidation,
    confirmValidation,
    findByIdValidation,
    deleteByIdValidation,
    createUserValidation,
    loginUserValidation
};