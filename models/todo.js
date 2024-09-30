"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }
    static addTodo({ title, dueDate, userId }) {
      return Todo.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }
    static async remove(id, userId) {
      return await Todo.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    static getTodo(userId) {
      return this.findAll({
        where: {
          userId,
        },
      });
    }
    markAsCompleted() {
      if (this.completed === true) {
        return this.update({ completed: false });
      }
      return this.update({ completed: true });
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Title is a required field" },
          len: 5,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        notNull: {
          notNull: { msg: "Due date is a required" },
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
