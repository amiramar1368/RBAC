import bcrypt from 'bcrypt';

import {models} from '../models/db.js';

export async function insertInitialData() {
    await models.Role.findOrCreate({
        where:{
            name:"admin"
        },
        defaults:{
            name:"admin"
        }
    })

    await models.Permission.findOrCreate({
        where:{
            name:"fetchUser"
        },
        defaults:{
            name:"fetchUser"
        }
    })

    const password = await bcrypt.hash("123",10)
    await models.User.findOrCreate({
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

    await models.RolePermission.findOrCreate({
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