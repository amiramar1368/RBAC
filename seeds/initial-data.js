import bcrypt from 'bcrypt';

import {User} from '../models/user.js';
import {Role} from '../models/role.js';
import {RolePermission} from '../models/role-permission.js';
import {Permission} from '../models/permission.js'

export async function insertInitialData() {
    await Role.findOrCreate({
        where:{
            name:"admin"
        },
        defaults:{
            name:"admin"
        }
    })

    await Permission.findOrCreate({
        where:{
            name:"fetchUser"
        },
        defaults:{
            name:"fetchUser"
        }
    })

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

    await RolePermission.findOrCreate({
        where:{
            role_id:1,
            permission_id:1,
        },
        defaults:{
            role_id:1,
            permission_id:1,
        }
    })
}