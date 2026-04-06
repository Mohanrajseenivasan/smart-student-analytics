const { Credential, User } = require('./models');

const check = async () => {
    const creds = await Credential.findAll();
    console.log('CREDENTIALS:');
    creds.forEach(c => console.log(c.email));

    const users = await User.findAll();
    console.log('USERS:');
    users.forEach(u => console.log(u.name, u.role));
}

check().catch(console.error);
