import { configStorage } from '~/configs';

export const types = {
    view: 'view',
    create: 'create',
    edit: 'edit',
    delete: 'delete',
};
export const getRoles = (name) => [
    `Permissions.${name}.View`,
    `Permissions.${name}.Create`,
    `Permissions.${name}.Edit`,
    `Permissions.${name}.Delete" `,
];
export const getRolesName = (permission, isSelect) => {
    const name = Object.values(types).find((x) => x === permission.split('.')[2].toLowerCase().trim());
    return {
        [name]: {
            isSelect: isSelect,
            permission,
        },
    };
};
export const findPermission = (pageName) => {
    const permissions = localStorage.getItem(configStorage.permissions)
        ? JSON.parse(localStorage.getItem(configStorage.permissions))
        : [];
    return permissions.find((x) => x.pageName === pageName);
};

export const isRoute = (pageName) => {
    const permission = findPermission(pageName);
    return permission?.view.isSelect || permission?.create.isSelect;
};
export const isPermissionCreate = (pageName) => {
    const permission = findPermission(pageName);
    return permission?.create.isSelect;
};
export const isPermissionView = (pageName) => {
    const permission = findPermission(pageName);
    return permission?.view.isSelect;
};
export const isPermissionEdit = (pageName) => {
    const permission = findPermission(pageName);
    return permission?.edit.isSelect;
};
export const isPermissionDelete = (pageName) => {
    const permission = findPermission(pageName);
    return permission?.delete.isSelect;
};
