let users = [];

const getUsers = (req, res) => {
    res.status(200).json(users);
};

const createUser = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    const user = {
        id: users.length + 1,
        name,
        email
    };

    users.push(user);

    res.status(201).json(user);
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find((u) => u.id === id);

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.status(200).json(user);
};

module.exports = {
    getUsers,
    createUser,
    getUserById
};