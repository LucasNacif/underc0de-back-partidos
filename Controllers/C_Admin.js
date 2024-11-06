const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  //registar un nuevo admin
  try {
    let { nombre, apellido, email, password, alias, cvu, telefono, sadmin } =
      req.body;
    const isAdminExist = await Admin.findOne({ where: { email: email } });

    if (isAdminExist) {
      res.status(400).json({
        msg: "Ya existe un admin con este correo: " + email,
        success: false,
      });
    }
    password = await bcrypt.hash(password, 8);
    const newAdmin = await Admin.create({
      nombre,
      apellido,
      email,
      password,
      alias,
      cvu,
      telefono,
      sadmin,
    });
    res.status(200).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: "internal error", success: false });
  }
};
exports.obtenerTodosLosAdmin = async (req, res) => {
  try {
    const adminRegistrados = await Admin.findAll();
    res.status(200).json(adminRegistrados);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ msg: error.message, success: false });
    } else {
      res.status(500).json({ error: "internal error", success: false });
    }
  }
};

exports.obtenerAdminPorId = async (req, res) => {
  try {
    const idAdmin = req.params.id;

    const admin = await Admin.findByPk(idAdmin);
    res.status(200).json(admin);
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

    return res.status(200).json({
      success: true,
      message: "Administrador eliminado exitosamente",
    });
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
    const { nombre, apellido, email, alias, cvu, telefono } = req.body;

    // verificar que venga el id
    if (!idAdmin) {
      return res.status(400).json({
        success: false,
        message: "El ID es requerido en los parametros",
      });
    }

    // Verificar si el admin existe
    const adminExiste = await Admin.findByPk(idAdmin);

    if (!adminExiste) {
      return res.status(404).json({
        success: false,
        message: `No se encontró un administrador con el ID: ${idAdmin}`,
      });
    }

    // Si se está cambiando el email, verificar que no exista ya
    if (email && email !== adminExiste.email) {
      const emailExiste = await Admin.findOne({
        where: { email: email },
      });

      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: `Ya existe un administrador con el email: ${email}`,
        });
      }
    }

    // Validar CVU si se está actualizando
    if (cvu && cvu.length !== 22) {
      return res.status(400).json({
        success: false,
        message: "El CVU debe tener 22 caracteres",
      });
    }

    // Validar email si se está actualizando
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Formato de email inválido",
        });
      }
    }

    // Crear objeto con campos a actualizar
    const camposActualizar = {};
    if (nombre) camposActualizar.nombre = nombre;
    if (apellido) camposActualizar.apellido = apellido;
    if (email) camposActualizar.email = email;
    if (alias) camposActualizar.alias = alias;
    if (cvu) camposActualizar.cvu = cvu;
    if (telefono) camposActualizar.telefono = telefono;

    // Actualizar el admin
    await Admin.update(camposActualizar, {
      where: {
        idAdmin: idAdmin,
      },
    });

    // Obtener el admin actualizado
    const adminActualizado = await Admin.findByPk(idAdmin);

    return res.status(200).json({
      success: true,
      message: "Administrador actualizado exitosamente",
      admin: adminActualizado,
    });
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
