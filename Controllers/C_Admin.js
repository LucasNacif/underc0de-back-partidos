const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  //registar un nuevo admin
  try {
    let { nombre, apellido, email, password, alias, cvu, telefono, sadmin } =
      req.body;
    const isAdminExist = await Admin.findOne({ where: { email: email } });

    if (isAdminExist) {
      return res.status(400).json({
        msg: "Ya existe un admin con este correo: " + email,
        success: false,
      });
    }
    password = await bcrypt.hash(password, 8);
    await Admin.create({
      nombre,
      apellido,
      email,
      password,
      alias,
      cvu,
      telefono,
      sadmin,
    });
    return res.status(201).send("Registrado exitosamente");
  } catch (error) {
    return res.status(500).json({ error: "internal error", success: false });
  }
};
exports.obtenerTodosLosAdmin = async (req, res) => {
  try {
    const adminRegistrados = await Admin.findAll();
    return res.status(200).json(adminRegistrados);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ msg: error.message, success: false });
    } else {
      return res.status(500).json({ error: "internal error", success: false });
    }
  }
};

exports.obtenerAdminPorId = async (req, res) => {
  try {
    const idAdmin = req.params.id;
    console.log(idAdmin);
    // verificar que venga el id
    if (!idAdmin || idAdmin == undefined) {
      return res.status(400).json({
        success: false,
        message: "El ID es requerido en los parametros",
      });
    }

    // Verificar si el admin existe
    const admin = await Admin.findByPk(idAdmin);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: `No se encontró un administrador con el ID: ${idAdmin}`,
      });
    }
    return res.status(200).json(admin);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ msg: error.message, success: false });
    } else {
      res.status(500).json({ error: "internal error", success: false });
    }
  }
};
exports.eliminarAdmin = async (req, res) => {
  try {
    const idAdmin = req.params.id;

    // Verificar si el admin existe
    const adminExiste = await Admin.findByPk(idAdmin);

    if (!adminExiste) {
      return res.status(404).json({
        success: false,
        message: `No se encontró un administrador con el ID: ${idAdmin}`,
      });
    }

    // Eliminar el admin
    await Admin.destroy({
      where: {
        idAdmin: idAdmin,
      },
    });

    return res.status(200).send("Administrador eliminado exitosamente");
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
};
exports.editarAdmin = async (req, res) => {
  try {
    const idAdmin = req.params.id;

    if (!idAdmin) {
      return res.status(400).json({
        success: false,
        message: "El ID es requerido en los parametros",
      });
    }

    const adminExist = await Admin.findByPk(idAdmin);
    if (!adminExist) {
      return res.status(404).json({
        success: false,
        message: `No se encontró un administrador con el ID: ${idAdmin}`,
      });
    }

    // Validaciones
    if (req.body.cvu && req.body.cvu.length !== 22) {
      return res.status(400).json({
        success: false,
        message: "El CVU debe tener 22 caracteres",
      });
    }

    if (req.body.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        return res.status(400).json({
          success: false,
          message: "Formato de email inválido",
        });
      }

      if (req.body.email !== adminExist.email) {
        const emailExist = await Admin.findOne({
          where: { email: req.body.email },
        });
        if (emailExist) {
          return res.status(400).json({
            success: false,
            message: `Ya existe un administrador con el email: ${req.body.email}`,
          });
        }
      }
    }

    // Actualizar
    await Admin.update(
      {
        ...adminExist.dataValues, // valores actuales
        ...req.body, // nuevos valores
      },
      {
        where: { idAdmin },
      }
    );

    const adminActualizado = await Admin.findByPk(idAdmin);
    return res.status(200).json({
      success: true,
      message: "Administrador actualizado exitosamente",
      admin: adminActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
};
