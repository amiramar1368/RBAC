import bcrypt from 'bcrypt';

import {User} from '../models/user.js';
import {Role} from '../models/role.js';
import {RolePermission} from '../models/role-permission.js';
import {Permission} from '../models/permission.js'

export async function insertInitialData() {
    const isCreatedFirstData = await Role.findByPk(1);
    if(!isCreatedFirstData){
        await Role.bulkCreate(
        [    {name:"admin" },
            {name:"user" },]
        );
        await Permission.bulkCreate([
            {name:"fetchUser"},
            {name:"addUser"},
            {name:"deleteUser"},
            {name:"editUser"},
        ])
        await RolePermission.bulkCreate([
            {
                role_id:1,
                permission_id:1,
            },
            {
                role_id:1,
                permission_id:2,
            },
            {
                role_id:1,
                permission_id:3,
            },
            {
                role_id:1,
                permission_id:4,
            },
        ]
        )
        const password = await bcrypt.hash("123",10)
        await User.findOrCreate({
            where:{
                login:"amir"
            },
            defaults:{
                name:"amir amarloo",
                login:"amir",
                password,
                role_id:1
            }
        })
    }
   
}